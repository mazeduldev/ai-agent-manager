package ai.verbex.chat.service;

import ai.verbex.chat.dto.ConversationDto;
import ai.verbex.chat.model.Conversation;
import ai.verbex.chat.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public List<ConversationDto> listConversationsByAgentId(String agentId) {
        List<Conversation> conversationList = conversationRepository.findByAgentId(agentId);
        return conversationList.stream().map(conversation -> new ConversationDto(
                conversation.getId(),
                conversation.getAgentId(),
                conversation.getFirstMessageSnippet(),
                conversation.getMessageCount(),
                null,
                conversation.getStartedAt(),
                conversation.getEndedAt()
        )).toList();
    }
}
