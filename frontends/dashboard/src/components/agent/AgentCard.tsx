"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	MessageCircle,
	History,
	Webhook,
	Trash2,
	Thermometer,
	ExternalLink,
	Copy,
} from "lucide-react";
import { toast } from "sonner";
import type { AgentDto } from "@/types/agent.type";

interface AgentCardProps {
	agent: AgentDto;
	onPublicChat?: (agentId: string) => void;
	onConversationHistory?: (agentId: string) => void;
	onEditWebhook?: (agentId: string) => void;
	onDeleteAgent?: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
	agent,
	onPublicChat,
	onConversationHistory,
	onEditWebhook,
	onDeleteAgent,
}) => {
	const copyWebhookUrl = async () => {
		if (agent.webhookUrl) {
			try {
				await navigator.clipboard.writeText(agent.webhookUrl);
				toast.success("Webhook URL copied to clipboard");
			} catch (error) {
				toast.error("Could not copy webhook URL");
			}
		}
	};

	const truncateText = (text: string, maxLength = 120) => {
		return text.length > maxLength
			? `${text.substring(0, maxLength)}...`
			: text;
	};

	return (
		<Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg font-semibold leading-tight">
						{agent.name}
					</CardTitle>
					<Badge variant="secondary" className="ml-2 flex items-center gap-1">
						<Thermometer className="h-3 w-3" />
						{agent.temperature}
					</Badge>
				</div>
				<CardDescription className="text-sm text-muted-foreground">
					{truncateText(agent.systemPrompt)}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex-1 pt-0">
				{agent.webhookUrl && (
					<div className="space-y-2">
						<Separator />
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<Webhook className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Webhook URL</span>
							</div>
							<div className="flex items-center gap-2 p-2 bg-muted rounded-md">
								<code className="text-xs text-muted-foreground flex-1 truncate">
									{agent.webhookUrl}
								</code>
								<Button
									variant="ghost"
									size="sm"
									onClick={copyWebhookUrl}
									className="h-6 w-6 p-0"
								>
									<Copy className="h-3 w-3" />
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardContent>

			<CardFooter className="pt-4">
				<div className="grid grid-cols-2 gap-2 w-full">
					<Button
						variant="default"
						size="sm"
						onClick={() => onPublicChat?.(agent.id)}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
					>
						<MessageCircle className="h-4 w-4" />
						Public Chat
						<ExternalLink className="h-3 w-3" />
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onConversationHistory?.(agent.id)}
						className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
					>
						<History className="h-4 w-4" />
						History
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onEditWebhook?.(agent.id)}
						className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
					>
						<Webhook className="h-4 w-4" />
						Edit
					</Button>

					<Button
						variant="destructive"
						size="sm"
						onClick={() => onDeleteAgent?.(agent.id)}
						className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};
