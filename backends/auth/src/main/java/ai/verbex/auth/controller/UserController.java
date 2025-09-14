package ai.verbex.auth.controller;

import ai.verbex.auth.dto.ApiKeyResponse;
import ai.verbex.auth.dto.UserResponse;
import ai.verbex.auth.model.User;
import ai.verbex.auth.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail()));
    }

    @PostMapping("/api-keys")
    public ResponseEntity<ApiKeyResponse> generateApiKey(Principal principal) {
        ApiKeyResponse apiKeyResponse = userService.generateApiKey(principal.getName());
        return ResponseEntity.ok(apiKeyResponse);
    }

    @DeleteMapping("/api-keys")
    public ResponseEntity<Void> revokeApiKey(Principal principal) {
        userService.revokeApiKey(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
