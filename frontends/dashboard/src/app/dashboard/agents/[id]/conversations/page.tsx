"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, User, Bot, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Types
interface Message {
	id: string;
	content: string;
	role: "USER" | "ASSISTANT";
	createdAt: string;
}

interface Conversation {
	id: string;
	firstMessageSnippet: string;
	messageCount: number;
	startedAt: string;
	endedAt: string;
	// messages: Message[];
}

const ConversationsPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const resolvedParams = React.use(params);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const agentId = resolvedParams.id;

	const conversationsQuery = useQuery({
		queryKey: ["conversations", agentId],
		queryFn: async (): Promise<Conversation[]> => {
			const res = await fetch(`/chatServer/conversations/agents/${agentId}`);
			if (!res.ok) {
				throw new Error("Failed to fetch conversations");
			}
			return res.json();
		},
	});

	const messagesQuery = useQuery<Message[]>({
		queryKey: ["messages", selectedConversation?.id],
		queryFn: async (): Promise<Message[]> => {
			if (!selectedConversation) return [];
			const res = await fetch(
				`/chatServer/conversations/${selectedConversation.id}/messages`,
			);
			if (!res.ok) {
				throw new Error("Failed to fetch messages");
			}
			return res.json();
		},
		enabled: !!selectedConversation,
	});

	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleString();
	};

	const truncateMessage = (message: string, maxLength = 60) => {
		return message?.length > maxLength
			? `${message.substring(0, maxLength)}...`
			: message;
	};

	return (
		<div className="h-[calc(100vh-8rem)] flex gap-4">
			{/* Left Sidebar - Conversations List */}
			<div className="w-1/3 min-w-[350px]">
				<Card className="h-full flex flex-col">
					<CardHeader className="pb-3 flex-shrink-0">
						<CardTitle className="text-lg flex items-center gap-2">
							<MessageCircle className="h-5 w-5" />
							Conversations
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							{conversationsQuery.data?.length} conversation(s) found
						</p>
					</CardHeader>
					<Separator />
					<CardContent className="p-0 flex-1 overflow-hidden">
						<ScrollArea className="h-full">
							<div className="space-y-1 p-4 pt-0">
								{conversationsQuery.data?.map((conversation) => (
									// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
									<div
										key={conversation.id}
										onClick={() => setSelectedConversation(conversation)}
										className={cn(
											"p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
											selectedConversation?.id === conversation.id
												? "bg-muted border-primary"
												: "bg-background",
										)}
									>
										<div className="space-y-2">
											{/* First Message Preview */}
											<p className="text-sm font-medium leading-tight">
												{truncateMessage(conversation.firstMessageSnippet)}
											</p>

											{/* Metadata */}
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<Hash className="h-3 w-3" />
													{conversation.messageCount}
												</div>
											</div>

											{/* Timestamps */}
											<div className="space-y-1 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													Started: {formatTime(conversation.startedAt)}
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													Ended: {formatTime(conversation.endedAt)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>

			{/* Right Side - Chat History */}
			<div className="flex-1">
				<Card className="h-full flex flex-col">
					{selectedConversation ? (
						<>
							<CardHeader className="pb-3 flex-shrink-0">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Chat History</CardTitle>
									<div className="flex items-center gap-2">
										<Badge variant="secondary">
											{selectedConversation.messageCount} messages
										</Badge>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">
									{formatTime(selectedConversation.startedAt)} -{" "}
									{formatTime(selectedConversation.endedAt)}
								</p>
							</CardHeader>
							<Separator />
							<CardContent className="p-0 flex-1 overflow-hidden">
								<ScrollArea className="h-full">
									<div className="space-y-4 px-4">
										{messagesQuery.data?.map((message) => (
											<div
												key={message.id}
												className={cn(
													"flex gap-3",
													message.role === "ASSISTANT"
														? "justify-start"
														: "justify-end",
												)}
											>
												{message.role === "ASSISTANT" && (
													<Avatar className="h-8 w-8 mt-1">
														<AvatarFallback className="bg-blue-100 text-blue-600">
															<Bot className="h-4 w-4" />
														</AvatarFallback>
													</Avatar>
												)}

												<div
													className={cn(
														"max-w-[70%] rounded-lg px-3 py-2 text-sm",
														message.role === "ASSISTANT"
															? "bg-muted text-foreground"
															: "bg-slate-600 text-white",
													)}
												>
													<p className="whitespace-pre-wrap">
														{message.content}
													</p>
													<p
														className={cn(
															"text-xs mt-1 opacity-70",
															message.role === "ASSISTANT"
																? "text-muted-foreground"
																: "text-white/70",
														)}
													>
														{formatTime(message.createdAt)}
													</p>
												</div>

												{message.role === "USER" && (
													<Avatar className="h-8 w-8 mt-1">
														<AvatarFallback className="bg-green-100 text-green-600">
															<User className="h-4 w-4" />
														</AvatarFallback>
													</Avatar>
												)}
											</div>
										))}
									</div>
								</ScrollArea>
							</CardContent>
						</>
					) : (
						<div className="h-full flex items-center justify-center">
							<div className="text-center space-y-2">
								<MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
								<h3 className="text-lg font-medium">Select a conversation</h3>
								<p className="text-sm text-muted-foreground">
									Choose a conversation from the left to view the chat history
								</p>
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default ConversationsPage;
