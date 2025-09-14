import { AgentForm } from "@/components/agent/AgentForm";
import { serverFetch } from "@/lib/serverFetch";
import type { AgentDto } from "@/types/agent.type";
import React from "react";

async function getAgent(agentId: string): Promise<AgentDto> {
	const response = await serverFetch(`/agentServer/agents/${agentId}`);
	if (!response.ok) {
		throw new Error("Could not fetch agent");
	}
	return response.json();
}

export default async function page({
	params,
}: { params: Promise<{ agentId: string }> }) {
	const { agentId } = await params;
	const agent = await getAgent(agentId);

	return <AgentForm agent={agent} />;
}
