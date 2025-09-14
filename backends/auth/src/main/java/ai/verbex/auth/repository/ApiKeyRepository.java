package ai.verbex.auth.repository;

import ai.verbex.auth.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, String> {
    boolean existsByUserId(String userId);

    void deleteByUserId(String userId);

    Optional<ApiKey> findByApiKeyPrefix(String apiKeyPrefix);
}
