package ai.verbex.chat.webclient;

import ai.verbex.chat.config.InternalFeignClientConfig;
import ai.verbex.chat.dto.AgentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "agent-server", url = "${internal.agent-server-url}", configuration = InternalFeignClientConfig.class)
public interface AgentServerClient {

    @GetMapping("/internal/agents/{agentId}")
    AgentDto getAgentById(@PathVariable("agentId") String agentId);
}
