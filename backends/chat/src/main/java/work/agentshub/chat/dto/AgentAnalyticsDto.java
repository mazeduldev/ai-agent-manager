package work.agentshub.chat.dto;

import java.time.LocalDateTime;

public record AgentAnalyticsDto(
        String agentId,
        Long totalConversations,
        Long totalMessages,
        LocalDateTime lastActivityTimestamp
) {
}
