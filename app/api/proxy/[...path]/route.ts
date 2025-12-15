// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8080';

async function handleProxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    // Await params here
    const { path } = await context.params;

    if (!path || path.length === 0) {
      console.error('❌ Missing proxy path:', context.params);
      return NextResponse.json({ error: 'Missing proxy path' }, { status: 400 });
    }

    const targetUrl = `${BACKEND_URL}/${path.join('/')}${req.nextUrl.search}`;
    console.log('➡ Proxying to:', targetUrl);

    // Include body only for methods that can have it
    const body = ['POST', 'PUT', 'PATCH'].includes(req.method!) ? await req.text() : undefined;

    // Forward headers (you can add more if needed)
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    // Return response as text
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (err: any) {
    console.error('❌ Proxy failed:', err);
    return NextResponse.json({ error: 'Proxy failed', message: err.message }, { status: 500 });
  }
}

// Export all HTTP methods
export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
