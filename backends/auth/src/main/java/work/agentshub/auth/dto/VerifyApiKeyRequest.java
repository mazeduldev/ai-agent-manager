package work.agentshub.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyApiKeyRequest(@NotBlank String apiKey) {
}
