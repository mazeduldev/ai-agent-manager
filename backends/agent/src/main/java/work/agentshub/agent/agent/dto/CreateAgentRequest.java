package work.agentshub.agent.agent.dto;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

public record CreateAgentRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 255)
        String name,

        @NotBlank(message = "System prompt is required")
        String systemPrompt,

        @NotNull(message = "Temperature is required")
        @DecimalMin("0.0")
        @DecimalMax("1.0")
        Double temperature,

        @URL(message = "Webhook URL must be a valid URL")
        @Size(max = 255)
        String webhookUrl) {
}
