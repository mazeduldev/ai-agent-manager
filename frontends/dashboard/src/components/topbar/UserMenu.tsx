"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import type { UserDto } from "@/types/auth.type";

type UserMenuProps = {
	user: UserDto;
};

export const UserMenu = ({ user: { email } }: UserMenuProps) => {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
			});
			if (res.ok) {
				router.replace("/auth/login");
			}
		} catch (error) {
			console.error("An error occurred during logout", error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
							{email.split("@")[0]}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
