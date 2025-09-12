package ai.verbex.agent.repository;

import ai.verbex.agent.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, String> {
}
