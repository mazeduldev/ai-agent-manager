package work.agentshub.agent.agent.dto;

public record ErrorResponse(
        String message,
        int statusCode,
        String timestamp) {
}
