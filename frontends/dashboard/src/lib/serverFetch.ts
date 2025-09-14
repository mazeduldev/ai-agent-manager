import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ServerFetchOptions extends RequestInit {
	requireAuth?: boolean;
}

const supportedBaseUrls = {
	authServer: process.env.AUTH_SERVER_URL,
	agentServer: process.env.AGENT_SERVER_URL,
	chatServer: process.env.CHAT_SERVER_URL,
};

export async function serverFetch(
	path: string,
	options: ServerFetchOptions = {},
) {
	const { requireAuth = true, headers = {}, ...fetchOptions } = options;

	console.log("Server fetch for path:", path);

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;
	const refreshToken = cookieStore.get("refresh_token")?.value;

	console.log("Access token exists:", !!accessToken);
	console.log("Refresh token exists:", !!refreshToken);

	// If auth is required but no tokens exist, redirect to login
	if (requireAuth && !accessToken && !refreshToken) {
		console.log("No tokens found, redirecting to login");
		redirect("/auth/login");
	}

	// Determine backend URL - similar to middleware logic
	const pathParts = path.startsWith("/")
		? path.slice(1).split("/")
		: path.split("/");
	const serverName = pathParts[0];
	const apiPath = pathParts.slice(1).join("/");

	console.log("Server Name:", serverName);
	console.log("API Path:", apiPath);

	const backendBaseUrl =
		supportedBaseUrls[serverName as keyof typeof supportedBaseUrls];

	if (!backendBaseUrl) {
		throw new Error(`Unsupported server: ${serverName}`);
	}

	const url = `${backendBaseUrl}/${apiPath}`;
	console.log("Final URL:", url);

	// Helper function to make the actual request
	const makeRequest = async (token?: string) => {
		const requestHeaders = new Headers({
			"Content-Type": "application/json",
			...headers,
		});

		if (token) {
			requestHeaders.set("Authorization", `Bearer ${token}`);
			console.log("Adding authorization header");
		}

		console.log("Making request to:", url);
		return fetch(url, {
			...fetchOptions,
			headers: requestHeaders,
		});
	};

	// First attempt with access token
	let response = await makeRequest(accessToken);
	console.log("First request status:", response.status);

	// If unauthorized and we have a refresh token, try to refresh
	if (
		(response.status === 401 || response.status === 403) &&
		refreshToken &&
		requireAuth
	) {
		console.log("Access token expired, attempting refresh");

		try {
			// Attempt to refresh the token
			const refreshUrl = `${supportedBaseUrls.authServer}/auth/refresh`;
			console.log("Refreshing token at:", refreshUrl);

			const refreshResponse = await fetch(refreshUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${refreshToken}`,
				},
			});

			console.log("Refresh response status:", refreshResponse.status);

			if (refreshResponse.ok) {
				const {
					access_token,
					refresh_token,
					access_token_expires_in,
					refresh_token_expires_in,
				} = await refreshResponse.json();
				console.log("Token refreshed successfully");

				// Set new access token in cookies
				cookieStore.set("access_token", access_token, {
					httpOnly: true,
					maxAge: access_token_expires_in,
					sameSite: "strict",
					path: "/",
				});
				cookieStore.set("refresh_token", refresh_token, {
					httpOnly: true,
					maxAge: refresh_token_expires_in,
					sameSite: "strict",
					path: "/",
				});

				// Retry the original request with new token
				response = await makeRequest(access_token);
				console.log("Retry request status:", response.status);
			} else {
				// Refresh failed, clear tokens and redirect to login
				console.log("Token refresh failed, clearing cookies");
				cookieStore.delete("access_token");
				cookieStore.delete("refresh_token");
				redirect("/auth/login");
			}
		} catch (error) {
			console.error("Token refresh failed:", error);
			cookieStore.delete("access_token");
			cookieStore.delete("refresh_token");
			redirect("/auth/login");
		}
	}

	// If still unauthorized after refresh attempt, redirect to login
	if ((response.status === 401 || response.status === 403) && requireAuth) {
		console.log("Still unauthorized after refresh, redirecting to login");
		cookieStore.delete("access_token");
		cookieStore.delete("refresh_token");
		redirect("/auth/login");
	}

	return response;
}

// Convenience wrapper for JSON responses
export async function serverFetchJson<T = unknown>(
	path: string,
	options: ServerFetchOptions = {},
): Promise<T> {
	const response = await serverFetch(path, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}
