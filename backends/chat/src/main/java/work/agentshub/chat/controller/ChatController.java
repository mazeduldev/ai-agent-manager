package work.agentshub.chat.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import work.agentshub.chat.dto.AgentDto;
import work.agentshub.chat.dto.ChatRequest;
import work.agentshub.chat.model.Conversation;
import work.agentshub.chat.model.Message;
import work.agentshub.chat.service.AgentService;
import work.agentshub.chat.service.ChatService;

import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final AgentService agentService;

    @PostMapping(path = "/{agentId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Map<String, Object>>> streamChat(@PathVariable String agentId,
                                                                 @Valid @RequestBody ChatRequest req) {
        AgentDto agentDto = agentService.getAgentById(agentId);

        Conversation conversation;
        if (req.conversationId() == null) {
            conversation = new Conversation();
            conversation.setAgentId(agentDto.getId());
            conversation.setFirstMessageSnippet(req.message());
            // messageCount removed - will be calculated dynamically
            conversation = chatService.saveConversation(conversation);

            // Call webhook for new conversation
            if (agentDto.getWebhookUrl() != null && !agentDto.getWebhookUrl().isBlank()) {
                log.debug(
                        "Triggering new conversation webhook for agentId: {}, conversationId: {}",
                        agentDto.getId(), conversation.getId());

                chatService.triggerNewConversationWebhook(
                        agentDto.getWebhookUrl(), agentDto.getId(), conversation.getId());
            }
        } else {
            conversation = chatService.getConversation(req.conversationId());
        }

        Message userMsg = new Message();
        userMsg.setConversation(conversation);
        userMsg.setRole(Message.Role.USER);
        userMsg.setContent(req.message());
        userMsg = chatService.saveMessage(userMsg);

        var prompt = chatService.buildPromptWithHistory(agentDto, conversation, req.message(), 10);

        log.debug(prompt.toString());

        AtomicReference<StringBuilder> collected = new AtomicReference<>(new StringBuilder());

        Flux<String> chunks = chatService.streamResponse(agentDto, prompt);

        ServerSentEvent<Map<String, Object>> initEvent = ServerSentEvent
                .<Map<String, Object>>builder(Map.of(
                        "conversationId", conversation.getId(),
                        "chunk", ""
                ))
                .event("init")
                .build();

        Conversation finalConversation = conversation;
        Flux<ServerSentEvent<Map<String, Object>>> chunkEvents = chunks
                .map(chunk -> {
                    collected.get().append(chunk);
                    return ServerSentEvent.<Map<String, Object>>builder(Map.of(
                                    "conversationId", finalConversation.getId(),
                                    "chunk", chunk
                            ))
                            .event("message")
                            .build();
                })
                .doOnComplete(() -> {
                    String full = collected.get().toString();
                    if (!full.isBlank()) {
                        Conversation updatedConversation = new Conversation(finalConversation);
                        // messageCount removed - will be calculated dynamically when needed
                        updatedConversation = chatService.saveConversation(updatedConversation);

                        Message assistantMsg = new Message();
                        assistantMsg.setConversation(updatedConversation);
                        assistantMsg.setRole(Message.Role.ASSISTANT);
                        assistantMsg.setContent(full);
                        chatService.saveMessage(assistantMsg);
                    }
                });

        return Flux.concat(Flux.just(initEvent), chunkEvents)
                .doOnError(err -> System.err.println("Error streaming: " + err.getMessage()));
    }
}
