package ai.verbex.chat.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ConversationDto(
        String id,
        String agentId,
        String firstMessageSnippet,
        Long messageCount,
        List<String> messageIds,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        LocalDateTime lastMessageCreatedAt
) {
}
