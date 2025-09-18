package work.agentshub.chat.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import work.agentshub.chat.model.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC")
    List<Message> findLastNByConversationDesc(String conversationId, Pageable pageable);

    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);
}
