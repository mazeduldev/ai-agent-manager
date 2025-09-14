package ai.verbex.agent.controller;

import ai.verbex.agent.model.Agent;
import ai.verbex.agent.service.AgentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/internal")
@Slf4j
public class InternalApiController {

    @Autowired
    private AgentService agentService;

    @GetMapping("/agents/{id}")
    public ResponseEntity<Agent> getAgentDetails(@PathVariable String id) {
        Agent agent = agentService.getAgentById(id);
        return ResponseEntity.ok(agent);
    }
}
