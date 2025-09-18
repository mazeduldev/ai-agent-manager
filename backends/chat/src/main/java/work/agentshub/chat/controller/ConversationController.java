package work.agentshub.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import work.agentshub.chat.dto.AgentDto;
import work.agentshub.chat.dto.ConversationDto;
import work.agentshub.chat.dto.MessageDto;
import work.agentshub.chat.exception.NotFoundException;
import work.agentshub.chat.model.Conversation;
import work.agentshub.chat.service.AgentService;
import work.agentshub.chat.service.ConversationService;
import work.agentshub.chat.service.MessageService;

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
    private final MessageService messageService;

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


    @GetMapping("/{conversationId}/messages")
    public List<MessageDto> getMessagesByConversationId(@PathVariable("conversationId") String conversationId, Principal principal) {
        // Get the conversation to verify ownership
        Conversation conversation = conversationService.getConversationById(conversationId);
        if (conversation == null) {
            throw new NotFoundException("Conversation not found.");
        }

        // Get the agent to verify user has access
        AgentDto agentDto = agentService.getAgentById(conversation.getAgentId());
        if (agentDto == null) {
            throw new NotFoundException("Agent not found.");
        }
        if (!agentDto.getUserId().equals(principal.getName())) {
            throw new AccessDeniedException("You do not have permission to access this conversation's messages.");
        }

        return messageService.getMessagesByConversationId(conversationId);
    }
}
