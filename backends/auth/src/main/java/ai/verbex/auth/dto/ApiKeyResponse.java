package ai.verbex.auth.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApiKeyResponse(@NotNull Long id, @NotBlank String apiKeyPrefix, @Nullable String apiKey) {
}
