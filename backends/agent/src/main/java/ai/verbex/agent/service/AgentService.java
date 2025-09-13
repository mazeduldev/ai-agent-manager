package ai.verbex.agent.service;

import ai.verbex.agent.dto.CreateAgentRequest;
import ai.verbex.agent.dto.UpdateAgentRequest;
import ai.verbex.agent.exception.NotFoundException;
import ai.verbex.agent.model.Agent;
import ai.verbex.agent.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
                .temperature(request.temperature())
                .webhookUrl(request.webhookUrl())
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

    public Agent updateAgent(String id, String userId, UpdateAgentRequest request) {
        Agent agent = getAgentById(id);
        if (!agent.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this agent");
        }
        agent.setName(request.name());
        agent.setSystemPrompt(request.systemPrompt());
        agent.setTemperature(request.temperature());
        agent.setWebhookUrl(request.webhookUrl());
        return agentRepository.save(agent);
    }

    public void deleteAgent(String id, String userId) {
        Agent agent = getAgentById(id);
        if (!agent.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to delete this agent");
        }
        // todo: delete related conversations and messages first
        agentRepository.deleteById(id);
    }
}
