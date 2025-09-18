package work.agentshub.agent.agent.dto;

public record AgentDto(
        String id,
        String name,
        String systemPrompt,
        Double temperature,
        String userId,
        String createdAt,
        String updatedAt
) {
}
