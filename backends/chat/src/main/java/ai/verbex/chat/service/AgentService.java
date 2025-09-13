package ai.verbex.chat.service;

import ai.verbex.chat.dto.AgentDto;
import ai.verbex.chat.webclient.AgentServerClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgentService {

    private final AgentServerClient agentServerClient;

    public AgentDto getAgentById(String agentId) {
        log.debug("Fetching agent details for agentId: {}", agentId);
        return agentServerClient.getAgentById(agentId);
    }
}
