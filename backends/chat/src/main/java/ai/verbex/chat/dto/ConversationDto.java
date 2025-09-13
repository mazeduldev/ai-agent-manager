package ai.verbex.chat.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ConversationDto(
        String id,
        String agentId,
        String firstMessageSnippet,
        Integer messageCount,
        List<String> messageIds,
        LocalDateTime startedAt,
        LocalDateTime endedAt
) {
}
