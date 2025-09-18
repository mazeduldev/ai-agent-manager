package work.agentshub.chat.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class AgentDto {
    @NotBlank
    private String id;

    @NotBlank
    private String userId;

    @NotBlank
    private String name;

    @NotBlank
    private String systemPrompt;

    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double temperature;

    private String webhookUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
