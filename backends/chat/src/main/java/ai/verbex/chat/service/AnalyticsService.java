package ai.verbex.chat.service;

import ai.verbex.chat.dto.AgentAnalyticsDto;
import ai.verbex.chat.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for handling analytics-related operations.
 * Ideally this should be a microservice on its own. Due to time constraints
 * we are keeping it simple for now.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService {

    private final AgentService agentService;
    private final ConversationRepository conversationRepository;

    public AgentAnalyticsDto getAgentAnalytics(String agentId) {
        log.debug("Calculating analytics for agentId: {}", agentId);

        // Verify agent exists
        agentService.getAgentById(agentId);

        // Get analytics data with a single optimized query
        ConversationRepository.AgentAnalyticsSummary summary = conversationRepository.getAgentAnalytics(agentId);

        // Handle null case (no conversations for agent)
        Long totalConversations = summary.getTotalConversations() != null ? summary.getTotalConversations() : 0L;
        Long totalMessages = summary.getTotalMessages() != null ? summary.getTotalMessages() : 0L;

        return new AgentAnalyticsDto(
                agentId,
                totalConversations,
                totalMessages,
                summary.getLastActivityTimestamp()
        );
    }
}
