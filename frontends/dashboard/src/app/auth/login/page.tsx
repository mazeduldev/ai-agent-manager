"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type FormData = {
	email: string;
	password: string;
};

type FormErrors = {
	email?: string;
	password?: string;
};

const LoginPage = () => {
	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [serverError, setServerError] = useState("");
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
			setServerError("");
		}
	};

	const validateForm = () => {
		const newErrors: FormErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (response.ok) {
					const data = await response.json();
					console.log("Logged in:", data);
					router.push("/dashboard"); // Redirect to dashboard
				} else {
					const errorData = await response.json();
					setServerError(errorData.message || "Login failed");
					console.error("Login failed:", errorData);
				}
			} catch (error) {
				console.error("Login error:", error);
				setServerError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>Log In</CardTitle>
				<CardDescription>
					Welcome back! Please sign in to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleInputChange}
							className={errors.email ? "border-red-500" : ""}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleInputChange}
							className={errors.password ? "border-red-500" : ""}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password}</p>
						)}
					</div>

					<Button type="submit" className="w-full">
						Log In
					</Button>

					{serverError && (
						<p className="text-sm text-red-500 text-center">{serverError}</p>
					)}
				</form>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<Link href="/auth/signup" className="text-blue-600 hover:underline">
							Sign Up
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default LoginPage;
