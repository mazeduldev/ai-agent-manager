import type { SignupRequest, TokenResponse } from "@/types/auth.type";
import type { NextRequest } from "next/server";
import type { ErrorResponse } from "@/types/error.type";
import { serialize } from "cookie";

// is token response predicate
function isTokenResponse(
	data: TokenResponse | ErrorResponse,
): data is TokenResponse {
	return (data as TokenResponse).access_token !== undefined;
}

export async function POST(req: NextRequest) {
	const authServerUrl = process.env.AUTH_SERVER_URL;

	try {
		const { email, password } = await req.json();

		// Call Spring Boot backend
		const response = await fetch(`${authServerUrl}/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password } as SignupRequest),
		});

		const data: TokenResponse | ErrorResponse = await response.json();

		if (response.ok && isTokenResponse(data)) {
			// Set HTTP-Only cookies
			const accessTokenCookie = serialize("access_token", data.access_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: data.access_token_expires_in,
				path: "/",
			});

			const refreshTokenCookie = serialize(
				"refresh_token",
				data.refresh_token,
				{
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: data.refresh_token_expires_in,
					path: "/",
				},
			);

			const res = new Response(
				JSON.stringify({
					id: data.user.id,
					email: data.user.email,
				}),
				{
					status: response.status,
				},
			);
			res.headers.append("Set-Cookie", accessTokenCookie);
			res.headers.append("Set-Cookie", refreshTokenCookie);

			// Return user data without tokens
			return res;
		}

		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error during signup:", error);
		return new Response(
			JSON.stringify({
				message: "Internal Server Error",
				statusCode: 500,
				timestamp: new Date().toISOString(),
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
