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

    @Column(name = "agent_id", nullable = false)
    private String agentId;

    @Column(name = "first_message_snippet", length = 255, nullable = false)
    private String firstMessageSnippet;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Message> messages;

    @CreationTimestamp
    @Column(name = "started_at", columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime startedAt;

    @UpdateTimestamp
    @Column(name = "ended_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime endedAt;

    public Conversation(Conversation c) {
        this.id = c.id;
        this.agentId = c.agentId;
        this.firstMessageSnippet = c.firstMessageSnippet;
        this.messages = c.messages;
        this.startedAt = c.startedAt;
        this.endedAt = c.endedAt;
    }
}
