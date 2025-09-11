import { type NextRequest, NextResponse } from "next/server";

const protectedPages = ["/dashboard"];
const authServerUrl = process.env.AUTH_SERVER_URL;

export async function middleware(request: NextRequest) {
	console.log("Middleware triggered for:", request.url);
	// Only intercept API calls to backend
	if (request.nextUrl.pathname.startsWith("/api/proxy/")) {
		// Get token from HTTP-Only cookie
		const accessToken = request.cookies.get("access_token")?.value;

		if (accessToken) {
			// Clone the request headers
			const requestHeaders = new Headers(request.headers);
			requestHeaders.set("Authorization", `Bearer ${accessToken}`);

			// Create new request with Authorization header
			const newRequest = new Request(request.url, {
				method: request.method,
				headers: requestHeaders,
				body: request.body,
			});

			return NextResponse.next({
				request: newRequest,
			});
		}
	}

	// Check authentication for protected pages
	if (
		protectedPages.some((page) => request.nextUrl.pathname.startsWith(page))
	) {
		const accessToken = request.cookies.get("access_token")?.value;
		const refreshToken = request.cookies.get("refresh_token")?.value;

		console.log("Attempting to access protected page: ", request.url);

		if (!accessToken && !refreshToken) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		if (!accessToken && refreshToken) {
			try {
				// Attempt to refresh the token
				const response = await fetch(`${authServerUrl}/auth/refresh`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh_token: refreshToken }),
				});

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

				return NextResponse.redirect(new URL("/auth/login", request.url));
			} catch (error) {
				console.error("Token refresh failed:", error);
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/proxy/:path*", "/dashboard/:path*"],
};
