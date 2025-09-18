package work.agentshub.auth.dto;

public record ErrorResponse(String message, int statusCode, String timestamp) {
}
