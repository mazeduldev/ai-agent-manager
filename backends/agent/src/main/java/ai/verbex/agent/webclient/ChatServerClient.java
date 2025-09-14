package ai.verbex.agent.webclient;

import ai.verbex.agent.config.InternalFeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "chat-server", url = "${internal.chat-server-url}", configuration = InternalFeignClientConfig.class)
public interface ChatServerClient {

    @DeleteMapping("/internal/conversations/by-agents/{agentId}")
    void deleteAllConversationsByAgentId(@PathVariable("agentId") String agentId);
}
