package work.agentshub.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import work.agentshub.chat.dto.AgentAnalyticsDto;
import work.agentshub.chat.dto.AgentDto;
import work.agentshub.chat.exception.NotFoundException;
import work.agentshub.chat.service.AgentService;
import work.agentshub.chat.service.AnalyticsService;

import java.security.Principal;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AgentService agentService;

    @GetMapping("/agents/{agentId}")
    public AgentAnalyticsDto getAgentAnalytics(@PathVariable("agentId") String agentId, Principal principal) {
        // Verify agent exists and user has access
        AgentDto agentDto = agentService.getAgentById(agentId);
        if (agentDto == null) {
            throw new NotFoundException("Agent not found.");
        }
        if (!agentDto.getUserId().equals(principal.getName())) {
            throw new AccessDeniedException("You do not have permission to access this agent's analytics.");
        }

        return analyticsService.getAgentAnalytics(agentId);
    }
}
