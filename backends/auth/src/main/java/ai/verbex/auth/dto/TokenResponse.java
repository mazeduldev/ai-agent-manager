package ai.verbex.auth.dto;

public record TokenResponse(String access_token, String refresh_token) {
}
