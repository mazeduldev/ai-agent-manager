package work.agentshub.chat.webclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import work.agentshub.chat.dto.WebhookPayload;

import java.net.URI;

@FeignClient(name = "external-web-client", url = "http://example.com")
public interface ExternalWebClient {
    @PostMapping()
    void postToWebhook(URI uri, WebhookPayload payload);
}
