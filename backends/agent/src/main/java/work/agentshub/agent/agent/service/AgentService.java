package work.agentshub.agent.agent.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import work.agentshub.agent.agent.dto.CreateAgentRequest;
import work.agentshub.agent.agent.dto.UpdateAgentRequest;
import work.agentshub.agent.agent.exception.NotFoundException;
import work.agentshub.agent.agent.model.Agent;
import work.agentshub.agent.agent.repository.AgentRepository;
import work.agentshub.agent.agent.webclient.ChatServerClient;

import java.util.List;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private ChatServerClient chatServerClient;

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

    public void deleteAgent(String agentId, String userId) {
        Agent agent = getAgentById(agentId);
        if (!agent.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to delete this agent");
        }
        chatServerClient.deleteAllConversationsByAgentId(agentId);
        agentRepository.deleteById(agentId);
    }
}
