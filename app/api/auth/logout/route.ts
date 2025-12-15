// app/api/auth/logout/route.ts
import { NextRequest } from 'next/server';
import { buildErrorResponse } from '@/lib/types/error-response';
import { getRefreshToken } from '@/lib/utils/cookies';
import { COOKIE_KEYS } from '@/lib/constants/auth-constant';
import { USER_INFO_KEY } from '@/providers/AuthProvider';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });
    }

    const nextResponse = buildErrorResponse('Logout Successfully', 200);

    // Clear cookies
    const cookieStore = nextResponse.cookies;

    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
    cookieStore.delete('user_info');

    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return buildErrorResponse('Internal Server Error', 500);
  }
}
