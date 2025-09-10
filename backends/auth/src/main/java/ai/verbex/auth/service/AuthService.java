package ai.verbex.auth.service;

import ai.verbex.auth.dto.LoginRequest;
import ai.verbex.auth.dto.SignupRequest;
import ai.verbex.auth.dto.TokenResponse;
import ai.verbex.auth.dto.UserResponse;
import ai.verbex.auth.exception.EmailAlreadyExistsException;
import ai.verbex.auth.model.User;
import ai.verbex.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public User register(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException();
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        return userRepository.save(user);
    }

    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse refresh(String refreshToken) {
        UserResponse userInfo = jwtService.extractUserInfoFromRefreshToken(refreshToken);
        User user = userRepository.findByEmail(userInfo.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!jwtService.validateRefreshToken(
                refreshToken,
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .build())) {
            throw new RuntimeException("Invalid refresh token");
        }
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}
