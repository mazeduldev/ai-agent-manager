package work.agentshub.chat.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InternalFeignClientConfig {

    @Value("${internal.api-key}")
    String internalApiKey;

    @Bean
    public RequestInterceptor feignClientInterceptor() {
        return template -> {
            template.header("X-INTERNAL-API-KEY", internalApiKey);
        };
    }
}
