package work.agentshub.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import work.agentshub.chat.dto.AgentDto;
import work.agentshub.chat.webclient.AgentServerClient;

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
