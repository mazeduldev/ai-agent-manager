import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage src="/avatars/01.png" alt="User" />
										<AvatarFallback>
											<User className="h-4 w-4" />
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											User Name
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											user@example.com
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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
