package ai.verbex.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "refresh_token is required")
        String refresh_token) {
}
