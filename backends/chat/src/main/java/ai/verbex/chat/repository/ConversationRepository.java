package ai.verbex.chat.repository;

import ai.verbex.chat.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByAgentId(String agentId);

    @Query("""
            SELECT c.id as conversationId,
                   c.agentId as agentId,
                   c.firstMessageSnippet as firstMessageSnippet,
                   c.startedAt as startedAt,
                   c.endedAt as endedAt,
                   COUNT(m.id) as messageCount,
                   MAX(m.createdAt) as lastMessageCreatedAt
            FROM Conversation c
            LEFT JOIN c.messages m
            WHERE c.agentId = :agentId
            GROUP BY c.id, c.agentId, c.firstMessageSnippet, c.startedAt, c.endedAt
            ORDER BY COALESCE(MAX(m.createdAt), c.startedAt) DESC
            """)
    List<ConversationSummary> findConversationSummariesByAgentId(@Param("agentId") String agentId);

    interface ConversationSummary {
        String getConversationId();

        String getAgentId();

        String getFirstMessageSnippet();

        LocalDateTime getStartedAt();

        LocalDateTime getEndedAt();

        Long getMessageCount();

        LocalDateTime getLastMessageCreatedAt();
    }
}
