package work.agentshub.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import work.agentshub.chat.service.ConversationService;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
@Slf4j
public class InternalApiController {

    private final ConversationService conversationService;

    @DeleteMapping("/conversations/by-agents/{agentId}")
    ResponseEntity<Void> deleteAllConversationsByAgentId(@PathVariable("agentId") String agentId) {
        conversationService.deleteAllConversationsByAgentId(agentId);
        return ResponseEntity.noContent().build();
    }
}
