package ai.verbex.auth.controller;

import ai.verbex.auth.dto.LoginRequest;
import ai.verbex.auth.dto.RefreshTokenRequest;
import ai.verbex.auth.dto.SignupRequest;
import ai.verbex.auth.dto.TokenResponse;
import ai.verbex.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody SignupRequest request) {
        TokenResponse tokenResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tokenResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse tokenResponse = authService.refresh(request.refresh_token());
        return ResponseEntity.ok(tokenResponse);
    }

}
