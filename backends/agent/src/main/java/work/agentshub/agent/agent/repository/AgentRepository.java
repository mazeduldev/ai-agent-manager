package work.agentshub.agent.agent.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import work.agentshub.agent.agent.model.Agent;

import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, String> {
    List<Agent> findByUserId(String userId);
}
