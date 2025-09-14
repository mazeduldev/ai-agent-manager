import { AgentCard } from "./AgentCard";
import type { AgentDto } from "@/types/agent.type";
import { useQuery } from "@tanstack/react-query";

export const AgentCardList = () => {
	const agentsQueryResult = useQuery({
		queryKey: ["agents"],
		queryFn: async (): Promise<AgentDto[]> => {
			const response = await fetch("/agentServer/agents");
			if (!response.ok) {
				throw new Error("Could not fetch agents");
			}
			return response.json();
		},
	});

	if (agentsQueryResult.isLoading) {
		return <div>Loading agents...</div>;
	}

	if (agentsQueryResult.isError) {
		return (
			<div>Error loading agents: {String(agentsQueryResult.error.message)}</div>
		);
	}

	const agents = agentsQueryResult.data || [];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
			{agents.map((agent) => (
				<AgentCard key={agent.id} agent={agent} />
			))}
		</div>
	);
};
