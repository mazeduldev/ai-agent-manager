package ai.verbex.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(
        @NotBlank(message = "Message cannot be empty")
        @Size(max = 4000, message = "Message too long")
        String message,
        String conversationId
) {
}
