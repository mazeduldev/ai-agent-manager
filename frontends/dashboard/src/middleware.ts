import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
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

	return NextResponse.next();
}

export const config = {
	matcher: "/api/proxy/:path*",
};
