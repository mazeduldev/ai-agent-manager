package work.agentshub.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.agentshub.auth.dto.LoginRequest;
import work.agentshub.auth.dto.SignupRequest;
import work.agentshub.auth.dto.TokenResponse;
import work.agentshub.auth.dto.UserResponse;
import work.agentshub.auth.exception.EmailAlreadyExistsException;
import work.agentshub.auth.model.User;
import work.agentshub.auth.repository.UserRepository;

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

    public TokenResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException();
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        User savedUser = userRepository.save(user);
        return new TokenResponse(
                jwtService.generateAccessToken(savedUser),
                jwtService.generateRefreshToken(savedUser),
                jwtService.getAccessTokenExpirationInSeconds(),
                jwtService.getRefreshTokenExpirationInSeconds(),
                new UserResponse(savedUser.getId(), savedUser.getEmail())
        );
    }

    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new TokenResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpirationInSeconds(),
                jwtService.getRefreshTokenExpirationInSeconds(),
                new UserResponse(user.getId(), user.getEmail())
        );
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
        return new TokenResponse(
                newAccessToken,
                newRefreshToken,
                jwtService.getAccessTokenExpirationInSeconds(),
                jwtService.getRefreshTokenExpirationInSeconds(),
                new UserResponse(user.getId(), user.getEmail())
        );
    }
}
