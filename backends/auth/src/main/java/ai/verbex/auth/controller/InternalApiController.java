package ai.verbex.auth.controller;

import ai.verbex.auth.dto.UserResponse;
import ai.verbex.auth.dto.VerifyApiKeyRequest;
import ai.verbex.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal")
@Slf4j
public class InternalApiController {

    @Autowired
    private UserService userService;

    @PostMapping("/verify-api-key")
    public ResponseEntity<UserResponse> verifyApiKey(@Valid @RequestBody VerifyApiKeyRequest request) {
        UserResponse userInfo = userService.verifyApiKey(request.apiKey());
        return ResponseEntity.ok(userInfo);
    }
}
