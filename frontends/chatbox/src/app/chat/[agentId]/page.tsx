"use client";

import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useRef, useState } from "react";

interface ChatEvent {
  chunk: string;
  conversationId: string;
}

interface Message {
  id: string;
  text: string;
  sender: "USER" | "AGENT";
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  // Add other agent properties as needed
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get these from your environment or props
  const chatServerUrl =
    process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "http://localhost:8200";
  const agentId = use(params).agentId;

  // Fetch agent details
  const {
    data: agent,
    isLoading: isAgentLoading,
    error: agentError,
  } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async (): Promise<Agent> => {
      const response = await fetch(`/agentServer/internal/agents/${agentId}`);
      if (!response.ok) {
        const json = await response.json();
        if (json?.message) {
          throw new Error(json.message);
        }
        throw new Error("Failed to fetch agent details");
      }
      return response.json();
    },
    enabled: !!agentId,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: I literally want this to run only when messages or streamingMessage change
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "USER",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${chatServerUrl}/chat/${agentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationId: conversationId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let agentResponseText = "";
      let currentConversationId = conversationId;
      let buffer = ""; // Buffer for incomplete lines

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Split by newlines but keep the last incomplete line in buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep the last (potentially incomplete) line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;

          // Parse Server-Sent Events format
          if (line.startsWith("data:")) {
            // const eventMatch = line.match(/^event:\s*(.+)$/);
            const dataMatch = line.match(/^data:\s*(.+)$/);

            if (dataMatch) {
              try {
                const eventData: ChatEvent = JSON.parse(dataMatch[1]);

                if (eventData.conversationId && !currentConversationId) {
                  currentConversationId = eventData.conversationId;
                  // setConversationId(eventData.conversationId);
                }

                // Handle init event (empty chunk)
                if (eventData.chunk === "") {
                  continue;
                }

                // Handle message events (append chunks)
                agentResponseText += eventData.chunk;
                setStreamingMessage(agentResponseText);
              } catch (error) {
                console.error("Error parsing event data:", error);
              }
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim() && buffer.startsWith("data:")) {
        try {
          const jsonStr = buffer.substring(5).trim(); // Remove "data:" prefix
          const eventData: ChatEvent = JSON.parse(jsonStr);

          if (eventData.chunk) {
            agentResponseText += eventData.chunk;
            setStreamingMessage(agentResponseText);
          }
        } catch (error) {
          console.error("Error parsing final buffer data:", error);
        }
      }

      // Finalize the agent message
      if (agentResponseText) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: agentResponseText,
          sender: "AGENT",
          timestamp: new Date(),
        };

        setConversationId(currentConversationId || null);
        setMessages((prev) => [...prev, agentMessage]);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Chat error:", error);
        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, there was an error processing your message. Please try again.",
          sender: "AGENT",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {isAgentLoading ? (
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          ) : agentError ? (
            "Chat Interface"
          ) : (
            agent?.name || "Chat Interface"
          )}
        </h1>
        {conversationId && (
          <p className="text-sm text-gray-500">
            Conversation ID: {conversationId}
          </p>
        )}
        {agentError && (
          <p className="text-sm text-red-500">{agentError.message}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === "USER"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "USER" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {(streamingMessage || isLoading) && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 text-gray-800">
              <p className="whitespace-pre-wrap">{streamingMessage}</p>
              <div className="flex items-center mt-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
