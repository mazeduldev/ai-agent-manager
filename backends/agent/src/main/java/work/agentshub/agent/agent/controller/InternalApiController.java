package work.agentshub.agent.agent.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import work.agentshub.agent.agent.model.Agent;
import work.agentshub.agent.agent.service.AgentService;

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
