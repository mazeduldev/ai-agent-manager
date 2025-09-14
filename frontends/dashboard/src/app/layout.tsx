import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProvider from "@/components/providers/AppProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AI Agent Dashboard",
	description: "A Place to Manage Your AI Agents",
};

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AppProvider>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					{children}
					<Toaster />
				</body>
			</AppProvider>
		</html>
	);
}
