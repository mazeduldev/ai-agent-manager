package ai.verbex.chat.dto;

public record ErrorResponse(String message, int statusCode, String timestamp) {
}
