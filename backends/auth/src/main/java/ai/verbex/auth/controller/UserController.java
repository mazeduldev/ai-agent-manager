package ai.verbex.auth.controller;

import ai.verbex.auth.dto.ApiKeyResponse;
import ai.verbex.auth.dto.UserResponse;
import ai.verbex.auth.model.User;
import ai.verbex.auth.service.JwtService;
import ai.verbex.auth.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail()));
    }

    @PostMapping("/api-keys")
    public ResponseEntity<ApiKeyResponse> generateApiKey() {
        ApiKeyResponse apiKeyResponse = userService.generateApiKey();
        return ResponseEntity.ok(apiKeyResponse);
    }
}
