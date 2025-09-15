"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Agent = {
  id: string;
  name: string;
  totalConversations: number;
  totalMessages: number;
  lastActivity: string;
};

const AnalyticsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentAnalytics = async () => {
      try {
        const response = await fetch("/agentServer/agents");
        if (!response.ok) {
          throw new Error("Failed to fetch agent data");
        }
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAgentAnalytics();
  }, []);

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTotalConversations = () => {
    return agents.reduce((total, agent) => total + agent.totalConversations, 0);
  };

  const getTotalMessages = () => {
    return agents.reduce((total, agent) => total + agent.totalMessages, 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalConversations()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalMessages()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No agents found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Agent Name</th>
                    <th className="text-left py-3 px-4">Conversations</th>
                    <th className="text-left py-3 px-4">Messages Sent</th>
                    <th className="text-left py-3 px-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{agent.name}</td>
                      <td className="py-3 px-4">{agent.totalConversations}</td>
                      <td className="py-3 px-4">{agent.totalMessages}</td>
                      <td className="py-3 px-4">
                        {agent.lastActivity
                          ? formatLastActivity(agent.lastActivity)
                          : "No activity"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
