"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Bot, Thermometer, Webhook, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CreateAgentRequest } from "@/types/agent.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const createAgentSchema = z.object({
	name: z
		.string()
		.min(1, "Agent name is required")
		.max(255, "Agent name must be less than 255 characters"),
	systemPrompt: z
		.string()
		.min(1, "System prompt is required")
		.min(10, "System prompt must be at least 10 characters"),
	temperature: z
		.number()
		.min(0, "Temperature must be between 0 and 1")
		.max(1, "Temperature must be between 0 and 1"),
	webhookUrl: z
		.string()
		.url("Please enter a valid URL")
		.max(255, "Webhook URL must be less than 255 characters")
		.optional()
		.or(z.literal("")),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

const page = () => {
	const router = useRouter();

	const agentMutation = useMutation({
		mutationFn: (data: CreateAgentRequest) =>
			fetch("/agentServer/agents", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}),
	});

	const form = useForm<CreateAgentFormData>({
		resolver: zodResolver(createAgentSchema),
		defaultValues: {
			name: "",
			systemPrompt: "",
			temperature: 0.7,
			webhookUrl: "",
		},
	});

	const handleSubmit = async (data: CreateAgentFormData) => {
		try {
			const submitData: CreateAgentRequest = {
				...data,
				webhookUrl: data.webhookUrl || undefined,
			};
			await agentMutation.mutateAsync(submitData);
			toast.success("Agent created successfully!");
			form.reset();
			router.push("/dashboard");
		} catch (error) {
			toast.error("Failed to create agent. Please try again.");
			console.error("Create agent error:", error);
		}
	};

	const temperatureValue = form.watch("temperature");

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Bot className="h-5 w-5 text-blue-600" />
					<CardTitle>Create New Agent</CardTitle>
				</div>
				<CardDescription>
					Configure your AI agent with a name, system prompt, and behavior
					settings.
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<CardContent className="space-y-6">
						{/* Agent Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter agent name (e.g., Customer Support Bot)"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A descriptive name for your AI agent.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* System Prompt */}
						<FormField
							control={form.control}
							name="systemPrompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>System Prompt</FormLabel>
									<FormControl>
										<Textarea
											placeholder="You are a helpful AI assistant that..."
											className="min-h-[120px] resize-none"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Define the behavior, personality, and instructions for your
										agent.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Temperature */}
						<FormField
							control={form.control}
							name="temperature"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Thermometer className="h-4 w-4" />
										Temperature
										<Badge variant="secondary" className="ml-2">
											{temperatureValue.toFixed(1)}
										</Badge>
									</FormLabel>
									<FormControl>
										<Slider
											min={0}
											max={1}
											step={0.1}
											value={[field.value]}
											onValueChange={(value) => field.onChange(value[0])}
											className="w-full"
										/>
									</FormControl>
									<FormDescription>
										Controls creativity. Lower values (0.1-0.3) for focused
										responses, higher values (0.7-1.0) for more creative
										outputs.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Webhook URL */}
						<FormField
							control={form.control}
							name="webhookUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Webhook className="h-4 w-4" />
										Webhook URL (Optional)
									</FormLabel>
									<FormControl>
										<Input
											placeholder="https://your-app.com/webhook"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Receive notifications when users interact with your agent.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardFooter className="flex gap-3 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								form.reset();
								router.push("/dashboard");
							}}
							disabled={agentMutation.isPending}
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={agentMutation.isPending}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{agentMutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create Agent
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};

export default page;
