import { type NextRequest, NextResponse } from "next/server";

const protectedPages = ["/dashboard"];
const supportedBaseUrls = {
	authServer: process.env.AUTH_SERVER_URL,
	agentServer: process.env.AGENT_SERVER_URL,
	chatServer: process.env.CHAT_SERVER_URL,
};

export async function middleware(req: NextRequest) {
	console.log("Middleware triggered for:", req.url);

	// Only intercept API calls to backend
	if (req.nextUrl.pathname.startsWith("/api/proxy/")) {
		// Determine backend URL
		const serverName = req.nextUrl.pathname.split("/")[3];
		console.log("Server Name:", serverName);

		const path = req.nextUrl.pathname.split("/").slice(4).join("/");
		console.log("Path:", path);

		const backendBaseUrl =
			supportedBaseUrls[serverName as keyof typeof supportedBaseUrls];

		const targetUrl = new URL(`${backendBaseUrl}/${path}`);
		targetUrl.search = req.nextUrl.search; // Preserve query parameters
		console.log("Proxying request to backend URL:", targetUrl);

		// Get token from HTTP-Only cookie
		const accessToken = req.cookies.get("access_token")?.value;
		const refreshToken = req.cookies.get("refresh_token")?.value;

		if (!accessToken && !refreshToken) {
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}

		const headers = new Headers(req.headers);
		headers.set("host", targetUrl.host);

		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

		// Forward request to backend
		let res = await fetch(targetUrl.toString(), {
			method: req.method,
			headers: headers,
			body:
				req.method !== "GET" && req.method !== "HEAD"
					? await req.text()
					: undefined,
			redirect: "manual",
		});

		// If access token is expired, try to refresh it
		if (res.status === 401 || res.status === 403) {
			const refreshRes = await fetch(
				`${supportedBaseUrls.authServer}/auth/refresh`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh_token: refreshToken }),
				},
			);

			if (refreshRes.ok) {
				const {
					access_token,
					refresh_token: new_refresh_token,
					access_token_expires_in,
					refresh_token_expires_in,
				} = await refreshRes.json();

				// Retry original request with new token
				headers.set("Authorization", `Bearer ${access_token}`);
				res = await fetch(targetUrl.toString(), {
					method: req.method,
					headers: headers,
					body:
						req.method !== "GET" && req.method !== "HEAD"
							? await req.text()
							: undefined,
					redirect: "manual",
				});

				// Set updated cookie for frontend
				const response = new NextResponse(res.body, {
					status: res.status,
					headers: res.headers,
				});
				response.cookies.set("access_token", access_token, {
					httpOnly: true,
					maxAge: access_token_expires_in,
					sameSite: "strict",
					path: "/",
				});
				response.cookies.set("refresh_token", new_refresh_token, {
					httpOnly: true,
					maxAge: refresh_token_expires_in,
					sameSite: "strict",
					path: "/",
				});
				return response;
			}

			// Refresh failed, redirect to login
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}

		// Valid access token, return backend response
		return new NextResponse(res.body, {
			status: res.status,
			headers: res.headers,
		});
	}

	// Check authentication for protected pages
	if (protectedPages.some((page) => req.nextUrl.pathname.startsWith(page))) {
		const accessToken = req.cookies.get("access_token")?.value;
		const refreshToken = req.cookies.get("refresh_token")?.value;

		console.log("Attempting to access protected page: ", req.url);

		if (!accessToken && !refreshToken) {
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}

		if (!accessToken && refreshToken) {
			try {
				// Attempt to refresh the token
				const response = await fetch(
					`${supportedBaseUrls.authServer}/auth/refresh`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ refresh_token: refreshToken }),
					},
				);

				if (response.ok) {
					const {
						access_token,
						refresh_token: new_refresh_token,
						access_token_expires_in,
						refresh_token_expires_in,
					} = await response.json();

					const nextResponse = NextResponse.next();
					nextResponse.cookies.set("access_token", access_token, {
						httpOnly: true,
						maxAge: access_token_expires_in,
						sameSite: "strict",
						path: "/",
					});
					if (new_refresh_token) {
						nextResponse.cookies.set("refresh_token", new_refresh_token, {
							httpOnly: true,
							maxAge: refresh_token_expires_in,
							sameSite: "strict",
							path: "/",
						});
					}
					return nextResponse;
				}

				return NextResponse.redirect(new URL("/auth/login", req.url));
			} catch (error) {
				console.error("Token refresh failed:", error);
				return NextResponse.redirect(new URL("/auth/login", req.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/proxy/:path*", "/dashboard/:path*"],
};
