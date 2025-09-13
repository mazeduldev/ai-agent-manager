package ai.verbex.chat.dto;

import java.time.LocalDateTime;

public record MessageDto(
        String id,
        String conversationId,
        String role,
        String content,
        LocalDateTime createdAt
) {
}