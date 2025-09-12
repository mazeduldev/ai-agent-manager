package ai.verbex.agent.repository;

import ai.verbex.agent.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, String> {
    List<Agent> findByUserId(String userId);
}
