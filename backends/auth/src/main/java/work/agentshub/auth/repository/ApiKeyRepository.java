package work.agentshub.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import work.agentshub.auth.model.ApiKey;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, String> {
    boolean existsByUserId(String userId);

    void deleteByUserId(String userId);

    Optional<ApiKey> findByApiKeyPrefix(String apiKeyPrefix);
}
