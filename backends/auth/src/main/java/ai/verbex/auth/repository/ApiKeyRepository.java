package ai.verbex.auth.repository;

import ai.verbex.auth.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
}
