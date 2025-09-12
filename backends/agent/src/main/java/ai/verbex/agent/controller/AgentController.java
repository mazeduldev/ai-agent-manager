package ai.verbex.agent.controller;

import ai.verbex.agent.dto.CreateAgentRequest;
import ai.verbex.agent.model.Agent;
import ai.verbex.agent.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController()
@RequestMapping("/agents")
public class AgentController {

    @Autowired
    private AgentService agentService;

    @PostMapping()
    public ResponseEntity<Agent> createAgent(Principal principal, @Valid @RequestBody CreateAgentRequest request) {
        Agent agent = agentService.createAgent(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(agent);
    }

    @GetMapping()
    public ResponseEntity<List<Agent>> listAgents(Principal principal) {
        return ResponseEntity.ok(agentService.listAgentsByUserId(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentDetails(@PathVariable String id) {
        Agent agent = agentService.getAgentById(id);
        return ResponseEntity.ok(agent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable String id, Principal principal) {
        Agent agent = agentService.getAgentById(id);
        if (!agent.getUserId().equals(principal.getName())) {
            throw new AccessDeniedException("You do not have permission to delete this agent");
        }
        agentService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }
}

