"use client";
import { AgentCardList } from "@/components/agent/AgentCardList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
	const router = useRouter();

	const handleCreateAgent = () => {
		router.push("/dashboard/agents/create");
	};

	return (
		<div className="space-y-6">
			{/* Header with Create Agent Button */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Your Agents</h1>
					<p className="text-muted-foreground">
						Manage and monitor your AI agents
					</p>
				</div>
				<Button
					onClick={handleCreateAgent}
					className="bg-blue-600 hover:bg-blue-700"
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Agent
				</Button>
			</div>

			{/* Agent Cards */}
			<AgentCardList />
		</div>
	);
};

export default Dashboard;
