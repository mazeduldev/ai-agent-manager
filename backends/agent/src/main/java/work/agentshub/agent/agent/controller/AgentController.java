package work.agentshub.agent.agent.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import work.agentshub.agent.agent.dto.AgentDto;
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
    public ResponseEntity<AgentDto> createAgent(
            Principal principal,
            @Valid @RequestBody CreateAgentRequest request) {
        AgentDto agentDto = agentService.createAgent(request, principal.getName()).toDto();
        return ResponseEntity.status(HttpStatus.CREATED).body(agentDto);
    }

    @GetMapping()
    public ResponseEntity<List<AgentDto>> listAgentsByUser(Principal principal) {
        return ResponseEntity.ok(
                agentService.listAgentsByUserId(principal.getName())
                        .stream().map(Agent::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentDto> getAgentDetails(@PathVariable String id) {
        Agent agent = agentService.getAgentById(id);
        return ResponseEntity.ok(agent.toDto());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentDto> updateAgent(
            @PathVariable String id,
            Principal principal,
            @Valid @RequestBody UpdateAgentRequest request) {
        Agent updated = agentService.updateAgent(id, principal.getName(), request);
        return ResponseEntity.ok(updated.toDto());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable String id, Principal principal) {
        agentService.deleteAgent(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

