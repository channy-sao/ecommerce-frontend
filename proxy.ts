// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_KEYS } from '@/lib/constants/auth-constant';

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  const publicRoutes = ['/login', '/api/auth/refresh'];

  // 1️⃣ PUBLIC ROUTES
  if (publicRoutes.includes(path)) {
    if (accessToken || refreshToken) {
      // Already logged in → redirect to home
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2️⃣ API routes → let them handle auth
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 3️⃣ PROTECTED PAGES → access token exists
  if (accessToken) {
    return NextResponse.next(); // stay on current page
  }

  // 4️⃣ TRY REFRESH TOKEN
  if (refreshToken) {
    try {
      const refreshUrl = new URL('/api/auth/refresh', request.nextUrl.origin);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          Cookie: request.headers.get('cookie') ?? '',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (refreshResponse.ok) {
        // Refresh succeeded → stay on the current route
        const response = NextResponse.next();

        // Forward new cookies from backend
        const setCookie = refreshResponse.headers.get('set-cookie');
        if (setCookie) response.headers.set('set-cookie', setCookie);

        return response;
      }
      // If refresh returns non-OK status (like 401), it's an auth error
      console.warn('Refresh token invalid or expired');
    } catch (err: any) {
      return NextResponse.redirect('/login');
    }
  }

  // 5️⃣ FAILED → redirect to login
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/profile/:path*',
    '/user-management/:path*',
    // '/roles/:path*',
    '/categories/:path*', // ⭐ CRITICAL: Add this!
    '/maintenance',
  ],
};
