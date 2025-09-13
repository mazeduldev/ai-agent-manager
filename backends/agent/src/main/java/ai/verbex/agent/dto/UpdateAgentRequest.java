package ai.verbex.agent.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record UpdateAgentRequest(
        @NotBlank
        @Size(max = 255)
        String name,

        @NotBlank
        String systemPrompt,

        @DecimalMin("0.0")
        @DecimalMax("1.0")
        Double temperature,

        @URL(message = "Webhook URL must be a valid URL")
        String webhookUrl) {
}