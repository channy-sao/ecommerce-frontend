// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { buildErrorResponse } from '@/lib/types/error-response';
import { COOKIE_KEYS } from '@/lib/constants/auth-constant';
import { LoginResponse } from '@/lib/types/auth';
import { BaseResponse } from '@/lib/types/base-response';
import { USER_INFO_KEY } from '@/providers/AuthProvider';

export async function POST(request: NextRequest) {
  console.log('=== LOGIN API START ===');
  try {
    console.log('📥 Request URL:', request.url);
    console.log('📥 Request method:', request.method);
    console.log('📥 Request headers:', Object.fromEntries(request.headers.entries()));

    const body = await request.json();

    // Call Spring Boot login endpoint
    // Call Spring Boot login endpoint
    console.log('📤 Calling Spring Boot API...');
    const startTime = Date.now();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/login/local`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Response time: ${responseTime}ms`);
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);

    const responseData: BaseResponse<LoginResponse> = await response.json();

    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status });
    }

    // Parse successful response
    console.log('✅ Spring Boot success response:', responseData?.toString());
    const accessToken = responseData.data?.accessToken;
    const refreshToken = responseData.data?.refreshToken;
    const refreshExpireInMs = responseData.data?.refreshTokenExpireInMs;
    const accessExpireInMs = responseData.data?.accessTokenExpireInMs;

    // Create response
    const nextResponse = NextResponse.json(responseData, { status: responseData.status?.code });

    // Set cookies with logging
    console.log('🍪 Setting cookies...');

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    nextResponse.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
      ...cookieOptions,
      maxAge: accessExpireInMs / 1000, // 15 minutes
    });

    nextResponse.cookies.set('user_info', JSON.stringify(responseData.data.userInfo), {
      ...cookieOptions,
      maxAge: refreshExpireInMs / 1000,
    });

    nextResponse.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
      ...cookieOptions,
      maxAge: refreshExpireInMs / 1000, // 7 days
    });

    // Log response headers for debugging
    console.log('📤 Response headers:', {
      status: nextResponse.status,
      contentType: nextResponse.headers.get('content-type'),
      cookies: nextResponse.headers.getSetCookie(),
    });

    console.log('=== LOGIN API SUCCESS ===');
    return nextResponse;
  } catch (error) {
    console.error('❌ Login API error:', error);

    if (error instanceof Error) {
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return buildErrorResponse('Service is unavailable', 503);
  } finally {
    console.log('=== LOGIN API END ===');
  }
}
