package ai.verbex.agent.service;

import ai.verbex.agent.dto.CreateAgentRequest;
import ai.verbex.agent.model.Agent;
import ai.verbex.agent.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
