import { serialize } from "cookie";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	// Clear cookies
	const clearAccessToken = serialize("access_token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 0,
		path: "/",
	});

	const clearRefreshToken = serialize("refresh_token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 0,
		path: "/",
	});

	const res = new Response(null, {
		status: 204,
	});

	res.headers.append("Set-Cookie", clearAccessToken);
	res.headers.append("Set-Cookie", clearRefreshToken);

	return res;
}
