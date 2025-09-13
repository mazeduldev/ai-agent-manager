package ai.verbex.chat.webclient;

import ai.verbex.chat.dto.WebhookPayload;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

import java.net.URI;

@FeignClient(name = "external-web-client", url = "http://example.com")
public interface ExternalWebClient {
    @PostMapping()
    void postToWebhook(URI uri, WebhookPayload payload);
}
