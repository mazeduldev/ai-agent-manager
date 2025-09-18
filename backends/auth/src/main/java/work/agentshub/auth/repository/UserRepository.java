package work.agentshub.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import work.agentshub.auth.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
