"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AgentCardList } from "@/components/agent/AgentCardList";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
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
        <div className="flex justify-end items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Link href="/dashboard/analytics">Analytics</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/agents/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Agent Cards */}
      <AgentCardList />
    </div>
  );
};

export default Dashboard;
