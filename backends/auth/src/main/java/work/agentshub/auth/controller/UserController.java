package work.agentshub.auth.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import work.agentshub.auth.dto.ApiKeyResponse;
import work.agentshub.auth.dto.UserResponse;
import work.agentshub.auth.model.User;
import work.agentshub.auth.service.UserService;

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
