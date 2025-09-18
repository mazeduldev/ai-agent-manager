package work.agentshub.chat.webclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import work.agentshub.chat.config.InternalFeignClientConfig;
import work.agentshub.chat.dto.AgentDto;

@FeignClient(name = "agent-server", url = "${internal.agent-server-url}", configuration = InternalFeignClientConfig.class)
public interface AgentServerClient {

    @GetMapping("/internal/agents/{agentId}")
    AgentDto getAgentById(@PathVariable("agentId") String agentId);
}
