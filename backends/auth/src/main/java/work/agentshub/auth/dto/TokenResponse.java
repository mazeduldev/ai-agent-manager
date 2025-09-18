package work.agentshub.auth.dto;

public record TokenResponse(
        String access_token,
        String refresh_token,
        Long access_token_expires_in,
        Long refresh_token_expires_in,
        UserResponse user) {
}
