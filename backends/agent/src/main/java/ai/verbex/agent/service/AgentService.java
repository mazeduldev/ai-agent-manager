package ai.verbex.agent.service;

import ai.verbex.agent.dto.CreateAgentRequest;
import ai.verbex.agent.exception.NotFoundException;
import ai.verbex.agent.model.Agent;
import ai.verbex.agent.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    public Agent createAgent(CreateAgentRequest request, String userId) {
        Agent agent = Agent.builder()
                .userId(userId)
                .name(request.name())
                .systemPrompt(request.systemPrompt())
                .temperature((request.temperature()))
                .build();
        return agentRepository.save(agent);
    }

    public List<Agent> listAgentsByUserId(String userId) {
        return agentRepository.findByUserId(userId);
    }

    public Agent getAgentById(String id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Agent not found"));
    }

    public void deleteAgent(String id) {
        if (agentRepository.existsById(id)) {
            // todo: delete related conversations and messages first
            agentRepository.deleteById(id);
        }
    }
}
