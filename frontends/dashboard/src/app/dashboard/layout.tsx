import type { ReactNode } from "react";
import { UserMenu } from "@/components/topbar/UserMenu";
import type { UserDto } from "@/types/auth.type";
import { serverFetchJson } from "@/lib/serverFetch";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const user = await serverFetchJson<UserDto>("/authServer/users/me");

	return (
		<div className="min-h-screen bg-background">
			{/* Top Navigation Bar */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
					{/* Logo */}
					<div className="mr-4 flex">
						<h1 className="text-xl font-semibold">AI Agent Management</h1>
					</div>

					{/* Spacer */}
					<div className="flex flex-1" />

					{/* Right side navigation */}
					<div className="flex items-center space-x-2">
						{/* User Menu */}
						<UserMenu user={user} />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
