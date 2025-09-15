package ai.verbex.chat.service;

import ai.verbex.chat.dto.ConversationDto;
import ai.verbex.chat.model.Conversation;
import ai.verbex.chat.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public List<ConversationDto> listConversationsByAgentId(String agentId) {
        List<ConversationRepository.ConversationSummary> summaries =
                conversationRepository.findConversationSummariesByAgentId(agentId);

        return summaries.stream()
                .map(this::convertSummaryToDto)
                .toList();
    }

    public Conversation getConversationById(String conversationId) {
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);
        return conversation.orElse(null);
    }

    public void deleteAllConversationsByAgentId(String agentId) {
        List<Conversation> conversations = conversationRepository.findByAgentId(agentId);
        conversationRepository.deleteAll(conversations);
        log.info("Deleted {} conversations for agentId: {}", conversations.size(), agentId);
    }

    private ConversationDto convertSummaryToDto(ConversationRepository.ConversationSummary summary) {
        return new ConversationDto(
                summary.getConversationId(),
                summary.getAgentId(),
                summary.getFirstMessageSnippet(),
                summary.getMessageCount(),
                null, // messageIds - not needed for listing
                summary.getStartedAt(),
                summary.getEndedAt(),
                summary.getLastMessageCreatedAt()
        );
    }
}
