package ai.verbex.auth.service;

import ai.verbex.auth.dto.ApiKeyResponse;
import ai.verbex.auth.exception.DuplicateApiKeyException;
import ai.verbex.auth.model.ApiKey;
import ai.verbex.auth.model.User;
import ai.verbex.auth.repository.ApiKeyRepository;
import ai.verbex.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public ApiKeyResponse generateApiKey() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = getUserByEmail(email);

        boolean isExistApiKey = apiKeyRepository.existsByUserId(user.getId());

        if (isExistApiKey) {
            throw new DuplicateApiKeyException();
        }

        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);

        String apiKeyString = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String apiKeyHash = passwordEncoder.encode(apiKeyString);

        ApiKey apiKey = new ApiKey();
        apiKey.setApiKeyHash(apiKeyHash);
        apiKey.setApiKeyPrefix(apiKeyString.substring(0, 10));
        apiKey.setUser(user);

        ApiKey savedApiKey = apiKeyRepository.save(apiKey);

        user.setApiKey(savedApiKey);
        userRepository.save(user);

        return new ApiKeyResponse(savedApiKey.getId(), savedApiKey.getApiKeyPrefix(), apiKeyString);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .build();
    }
}
