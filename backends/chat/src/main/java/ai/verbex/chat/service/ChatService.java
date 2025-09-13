package ai.verbex.chat.service;

import ai.verbex.chat.dto.AgentDto;
import ai.verbex.chat.dto.WebhookPayload;
import ai.verbex.chat.exception.NotFoundException;
import ai.verbex.chat.model.Conversation;
import ai.verbex.chat.model.Message;
import ai.verbex.chat.repository.ConversationRepository;
import ai.verbex.chat.repository.MessageRepository;
import ai.verbex.chat.webclient.ExternalWebClient;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final OpenAiApi.ChatModel defaultModel = OpenAiApi.ChatModel.GPT_4_1_NANO;
    private final ChatClient.Builder chatClientBuilder;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ExternalWebClient externalWebClient;

    public Conversation saveConversation(Conversation conversation) {
        return conversationRepository.save(conversation);
    }

    public Conversation getConversation(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));
    }

    public Message saveMessage(Message userMsg) {
        return messageRepository.save(userMsg);
    }

    public Prompt buildPromptWithHistory(AgentDto agent, Conversation conversation, String userMessage, int historyCount) {
        List<org.springframework.ai.chat.messages.Message> messages = new ArrayList<>();

        if (agent.getSystemPrompt() != null && !agent.getSystemPrompt().isBlank()) {
            messages.add(new SystemMessage(agent.getSystemPrompt()));
        }

        List<Message> lastN = messageRepository.findLastNByConversationDesc(conversation.getId(), PageRequest.of(0, historyCount));
        Collections.reverse(lastN);
        for (Message m : lastN) {
            if (Message.Role.ASSISTANT.equals(m.getRole())) {
                messages.add(new AssistantMessage(m.getContent()));
            } else if (Message.Role.USER.equals(m.getRole())) {
                messages.add(new UserMessage(m.getContent()));
            }
        }

        messages.add(new UserMessage(userMessage));

        ChatOptions opts = ChatOptions.builder()
                .model(defaultModel.getValue())
                .temperature(agent.getTemperature() != null ? agent.getTemperature() : 0.7)
                .build();

        return new Prompt(messages, opts);
    }

    public Flux<String> streamResponse(AgentDto agent, Prompt prompt) {
        ChatClient chatClient = chatClientBuilder.build();
        return chatClient.prompt(prompt).stream().content();
    }

    public void triggerNewConversationWebhook(
            @NotBlank String webhookUrl,
            @NotBlank String agentId,
            @NotBlank String conversationId) {

        try {
            URI uri = URI.create(webhookUrl);
            externalWebClient.postToWebhook(uri, new WebhookPayload(agentId, conversationId));
            log.info("Successfully triggered webhook for conversationId: {}", conversationId);
        } catch (Exception e) {
            log.error("Failed to trigger webhook for conversationId: {}", e.getMessage());
        }
    }
}
