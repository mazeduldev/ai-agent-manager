"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentDto } from "@/types/agent.type";

type AgentAnalytics = {
  agentId: string;
  totalConversations: number;
  totalMessages: number;
  lastActivityTimestamp: string;
};

const AnalyticsPage = () => {
  const {
    data: agents,
    isLoading: agentsLoading,
    isError: agentsError,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: async (): Promise<AgentDto[]> => {
      const response = await fetch("/agentServer/agents");
      if (!response.ok) {
        throw new Error("Could not fetch agents");
      }
      return response.json();
    },
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useQuery({
    queryKey: ["analytics", agents?.map((agent) => agent.id)],
    queryFn: async (): Promise<AgentAnalytics[]> => {
      if (!agents) return [];

      const analyticsPromises = agents.map(async (agent) => {
        const response = await fetch(
          `/chatServer/analytics/agents/${agent.id}`,
        );
        if (!response.ok) {
          throw new Error(`Could not fetch analytics for agent ${agent.id}`);
        }
        return response.json();
      });

      return Promise.all(analyticsPromises);
    },
    enabled: !!agents && agents.length > 0,
  });

  const formatLastActivity = (timestamp: string) => {
    if (!timestamp) return "No activity";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTotalConversations = () => {
    return (
      analyticsData?.reduce(
        (total, analytics) => total + analytics.totalConversations,
        0,
      ) || 0
    );
  };

  const getTotalMessages = () => {
    return (
      analyticsData?.reduce(
        (total, analytics) => total + analytics.totalMessages,
        0,
      ) || 0
    );
  };

  const getAgentName = (agentId: string) => {
    return (
      agents?.find((agent) => agent.id === agentId)?.name || "Unknown Agent"
    );
  };

  if (agentsLoading || analyticsLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (agentsError || analyticsError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="text-center text-red-500">
          Error loading analytics data
        </div>
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
            <div className="text-2xl font-bold">{agents?.length || 0}</div>
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
          {!analyticsData || analyticsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No analytics data available
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
                  {analyticsData.map((analytics) => (
                    <tr
                      key={analytics.agentId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {getAgentName(analytics.agentId)}
                      </td>
                      <td className="py-3 px-4">
                        {analytics.totalConversations}
                      </td>
                      <td className="py-3 px-4">{analytics.totalMessages}</td>
                      <td className="py-3 px-4">
                        {formatLastActivity(analytics.lastActivityTimestamp)}
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
