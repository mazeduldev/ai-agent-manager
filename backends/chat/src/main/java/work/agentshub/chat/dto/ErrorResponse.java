package work.agentshub.chat.dto;

public record ErrorResponse(String message, int statusCode, String timestamp) {
}
