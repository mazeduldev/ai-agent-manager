package work.agentshub.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import work.agentshub.chat.dto.MessageDto;
import work.agentshub.chat.model.Message;
import work.agentshub.chat.repository.MessageRepository;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<MessageDto> getMessagesByConversationId(String conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messages.stream()
                .map(this::convertToDto)
                .toList();
    }

    private MessageDto convertToDto(Message message) {
        return new MessageDto(
                message.getId(),
                message.getConversation().getId(),
                message.getRole().name(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
