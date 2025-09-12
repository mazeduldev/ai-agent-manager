package ai.verbex.agent.controller;

import ai.verbex.agent.dto.CreateAgentRequest;
import ai.verbex.agent.model.Agent;
import ai.verbex.agent.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

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
}
