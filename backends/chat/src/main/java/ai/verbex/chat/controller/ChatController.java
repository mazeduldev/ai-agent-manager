package ai.verbex.chat.controller;

import ai.verbex.chat.dto.AgentDto;
import ai.verbex.chat.service.AgentService;
import ai.verbex.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final AgentService agentService;

    @GetMapping("/agents/{agentId}")
    public ResponseEntity<AgentDto> getAgentDetails(@PathVariable String agentId) {
        return ResponseEntity.ok(agentService.getAgentById(agentId));
    }

    //    @PostMapping(path = "/{agentId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    //    public Flux<ServerSentEvent<Map<String, Object>>> streamChat(@PathVariable Long agentId,
    //                                                                 @RequestParam(required = false) Long conversationId,
    //                                                                 @RequestBody SendRequest req) {
    //        Agent agent = chatService.getAgent(agentId);
    //
    //        Conversation conversation;
    //        if (conversationId == null) {
    //            conversation = new Conversation();
    //            conversation.setAgent(agent);
    //            conversation.setTitle("New Conversation");
    //            conversation.setCreatedAt(Instant.now());
    //            conversation = chatService.createConversation(conversation);
    //        } else {
    //            conversation = chatService.getConversation(conversationId);
    //        }
    //
    //        Message userMsg = new Message();
    //        userMsg.setConversation(conversation);
    //        userMsg.setRole("user");
    //        userMsg.setContent(req.content());
    //        userMsg.setCreatedAt(Instant.now());
    //        chatService.saveMessage(userMsg);
    //
    //        var prompt = chatService.buildPromptWithHistory(agent, conversation, req.content(), 10);
    //
    //        AtomicReference<StringBuilder> collected = new AtomicReference<>(new StringBuilder());
    //
    //        Flux<String> chunks = chatService.streamResponse(agent, prompt);
    //
    //        ServerSentEvent<Map<String, Object>> initEvent = ServerSentEvent
    //                .<Map<String, Object>>builder(Map.of("conversationId", conversation.getId(), "chunk", ""))
    //                .event("init")
    //                .build();
    //
    //        Flux<ServerSentEvent<Map<String, Object>>> chunkEvents = chunks
    //                .map(chunk -> {
    //                    collected.get().append(chunk);
    //                    return ServerSentEvent.<Map<String, Object>>builder(
    //                            Map.of("conversationId", conversation.getId(), "chunk", chunk)
    //                    ).event("message").build();
    //                })
    //                .doOnComplete(() -> {
    //                    String full = collected.get().toString();
    //                    if (!full.isBlank()) {
    //                        Message assistantMsg = new Message();
    //                        assistantMsg.setConversation(conversation);
    //                        assistantMsg.setRole("assistant");
    //                        assistantMsg.setContent(full);
    //                        assistantMsg.setCreatedAt(Instant.now());
    //                        chatService.saveMessage(assistantMsg);
    //                    }
    //                });
    //
    //        return Flux.concat(Flux.just(initEvent), chunkEvents)
    //                .doOnError(err -> System.err.println("Error streaming: " + err.getMessage()));
    //    }

    //    @GetMapping("/{agentId}/conversations")
    //    public ResponseEntity<?> getConversations(@PathVariable String agentId) {
    //        return ResponseEntity.ok(chatService.getConversations(agentId));
    //    }
}
