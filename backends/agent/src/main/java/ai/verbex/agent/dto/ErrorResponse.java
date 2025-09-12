package ai.verbex.agent.dto;

public record ErrorResponse(
        String message,
        int statusCode,
        String timestamp) {
}
