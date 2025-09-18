package work.agentshub.agent.agent.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import work.agentshub.agent.agent.dto.CreateAgentRequest;
import work.agentshub.agent.agent.dto.UpdateAgentRequest;
import work.agentshub.agent.agent.model.Agent;
import work.agentshub.agent.agent.service.AgentService;

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
    public ResponseEntity<List<Agent>> listAgentsByUser(Principal principal) {
        return ResponseEntity.ok(agentService.listAgentsByUserId(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentDetails(@PathVariable String id) {
        Agent agent = agentService.getAgentById(id);
        return ResponseEntity.ok(agent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agent> updateAgent(
            @PathVariable String id,
            Principal principal,
            @Valid @RequestBody UpdateAgentRequest request) {
        Agent updated = agentService.updateAgent(id, principal.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable String id, Principal principal) {
        agentService.deleteAgent(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

