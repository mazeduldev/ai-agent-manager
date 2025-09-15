import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the internal agent server API
  if (pathname.startsWith('/agentServer/internal/')) {
    const agentServerUrl = process.env.AGENT_SERVER_URL;
    const internalApiKey = process.env.INTERNAL_API_KEY;

    if (!agentServerUrl) {
      return NextResponse.json(
        { message: 'Agent server URL not configured' },
        { status: 500 }
      );
    }

    if (!internalApiKey) {
      return NextResponse.json(
        { message: 'Internal API key not configured' },
        { status: 500 }
      );
    }

    // Remove '/agentServer' from the pathname
    const targetPath = pathname.replace('/agentServer', '');
    const targetUrl = new URL(targetPath, agentServerUrl);
    
    // Copy query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Create new request with modified URL and headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-INTERNAL-API-KEY', internalApiKey);

    // Create the proxied request
    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: requestHeaders,
      body: request.body,
      // @ts-ignore - NextJS specific
      duplex: 'half',
    });

    return fetch(proxiedRequest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/agentServer/internal/:path*',
};