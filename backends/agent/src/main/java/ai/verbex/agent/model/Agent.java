package ai.verbex.agent.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false) // not using foreign key to simulate dedicated db per service
    @NotBlank
    private String userId;

    @Column(name = "name", length = 255, nullable = false)
    @NotBlank
    @Size(max = 255)
    private String name;

    @Column(name = "system_prompt", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String systemPrompt;

    @Column(name = "temperature", precision = 2)
    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double temperature;

    @Column(name = "webhook_url", length = 500)
    @Size(max = 500)
    private String webhookUrl;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
}
