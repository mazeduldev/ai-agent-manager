export interface AgentDto {
	id: string;
	userId: string;
	name: string;
	systemPrompt: string;
	temperature: number; // 0.0 to 1.0
	webhookUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateOrUpdateAgentRequest {
	name: string;
	systemPrompt: string;
	temperature: number;
	webhookUrl?: string;
}
