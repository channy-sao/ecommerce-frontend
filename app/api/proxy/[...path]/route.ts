// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { buildErrorResponse } from '@/lib/types/error-response';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8080';

async function handleProxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;

    if (!path || path.length === 0) {
      return buildErrorResponse(
        'Missing proxy path',
        400,
        `proxy-${Date.now()}`,
        req.nextUrl.pathname
      );
    }

    const targetUrl = `${BACKEND_URL}/${path.join('/')}${req.nextUrl.search}`;

    // Clone headers but remove problematic headers
    const headers = new Headers(req.headers);
    headers.delete('content-length');
    headers.delete('host');

    // Prepare fetch options with proper typing
    const fetchOptions: any = {
      method: req.method,
      headers,
    };

    // Handle body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;

      // ✅ REQUIRED for Node.js with streaming body
      fetchOptions.duplex = 'half';
    }

    const res = await fetch(targetUrl, fetchOptions);

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, {
        status: res.status,
        headers: {
          'X-Backend-Status': `${res.status}`,
        },
      });
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (error) {
    console.error('❌ Proxy failed:', error);
    return buildErrorResponse('Proxy failed', 500, `proxy-${Date.now()}`, req.nextUrl.pathname);
  }
}

// Export all HTTP methods
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
export const HEAD = handleProxy;