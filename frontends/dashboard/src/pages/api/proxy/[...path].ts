import type { NextApiRequest, NextApiResponse } from "next";

// Supported base server and urls
const baseUrl = {
	authServer: process.env.AUTH_SERVER_URL || "http://localhost:8080",
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { path } = req.query;
	console.log("Proxying request to path:", path);

	// Determine backend URL
	let baseServerUrl = "";
	let newPath = "";

	if (Array.isArray(path)) {
		const baseServer = path[0];
		baseServerUrl = baseUrl[baseServer as keyof typeof baseUrl];
		newPath = `/${path.slice(1).join("/")}`;
	} else {
		baseServerUrl = baseUrl[path as keyof typeof baseUrl];
	}

	const backendUrl = `${baseServerUrl}${newPath}`;

	console.log("Constructed Backend URL:", backendUrl);

	// Get token from cookie
	const refreshToken = req.cookies.refresh_token;

	try {
		console.log("Forwarding request to Spring Boot backend");
		let response = await fetch(backendUrl, {
			method: req.method,
			headers: req.headers as HeadersInit,
			body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
		});

		// Handle token refresh on 401
		if ((response.status === 401 || response.status === 403) && refreshToken) {
			console.log("Attempting token refresh");
			try {
				const refreshResponse = await fetch(
					`${baseUrl.authServer}/auth/refresh`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ refresh_token: refreshToken }),
					},
				);

				if (refreshResponse.ok) {
					const tokenData = await refreshResponse.json();

					// Update cookies with new tokens
					const { serialize } = await import("cookie");
					const accessTokenCookie = serialize(
						"access_token",
						tokenData.access_token,
						{
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
							sameSite: "strict",
							maxAge: tokenData.access_token_expires_in,
							path: "/",
						},
					);

					const refreshTokenCookie = serialize(
						"refresh_token",
						tokenData.refresh_token,
						{
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
							sameSite: "strict",
							maxAge: tokenData.refresh_token_expires_in,
							path: "/",
						},
					);

					res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);

					console.log("Retrying original request with new access token");

					const headers = {
						...req.headers,
						authorization: `Bearer ${tokenData.access_token}`,
					};
					response = await fetch(backendUrl, {
						method: req.method,
						headers: headers as unknown as HeadersInit,
						body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
					});
				}
			} catch (error) {
				console.error("Error during token refresh:", error);
			}
		}

		const data = await response.json();
		res.status(response.status).json(data);
	} catch (error) {
		res.status(500).json({ message: "Proxy error" });
	}
}
