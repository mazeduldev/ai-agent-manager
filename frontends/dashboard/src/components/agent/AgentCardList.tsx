import { useEffect, useState } from "react";
import { AgentCard } from "./AgentCard";
import type { AgentDto } from "@/types/agent.type";

export const AgentCardList = () => {
	const [agents, setAgents] = useState<AgentDto[]>([]);

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const response = await fetch("/agentServer/agents");
				if (response.ok) {
					const data = await response.json();
					setAgents(data);
				} else {
					console.error("Failed to fetch agents");
				}
			} catch (error) {
				console.error("An error occurred while fetching agents", error);
			}
		};
		fetchAgents();
	}, []);

	// In your component
	return (
		<>
			{agents.map((agent) => (
				<AgentCard key={agent.id} agent={agent} />
			))}
		</>
	);
};
