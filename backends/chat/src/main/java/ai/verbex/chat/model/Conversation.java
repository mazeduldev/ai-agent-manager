package ai.verbex.chat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Column(name = "user_id")
    private String userId;

    @CreationTimestamp
    @Column(name = "started_at", columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime startedAt;

    @UpdateTimestamp
    @Column(name = "ended_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime endedAt;

    @Column(name = "message_count", nullable = false)
    private Integer messageCount = 0;
}
