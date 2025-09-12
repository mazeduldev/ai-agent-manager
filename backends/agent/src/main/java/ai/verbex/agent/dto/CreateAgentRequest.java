package ai.verbex.agent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAgentRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "System prompt is required")
        String systemPrompt,

        @NotNull(message = "Temperature is required")
        Double temperature) {
}
