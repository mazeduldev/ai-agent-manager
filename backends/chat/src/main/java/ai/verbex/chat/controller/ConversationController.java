package ai.verbex.chat.controller;

import ai.verbex.chat.dto.AgentDto;
import ai.verbex.chat.dto.ConversationDto;
import ai.verbex.chat.exception.NotFoundException;
import ai.verbex.chat.service.AgentService;
import ai.verbex.chat.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/conversations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ConversationService conversationService;
    private final AgentService agentService;

    @GetMapping("/agents/{agentId}")
    public List<ConversationDto> listConversationsByAgentIdAndUser(@PathVariable("agentId") String agentId, Principal principal) {
        AgentDto agentDto = agentService.getAgentById(agentId);
        if (agentDto == null) {
            throw new NotFoundException("Agent not found.");
        }
        if (!agentDto.getUserId().equals(principal.getName())) {
            throw new AccessDeniedException("You do not have permission to access this agent's conversations.");
        }
        return conversationService.listConversationsByAgentId(agentDto.getId());
    }
}
