import { NextRequest, NextResponse } from 'next/server';
import { getInitialUser, getRefreshToken } from '@/lib/utils/cookies';
import { buildErrorResponse } from '@/lib/types/error-response';
import { RefreshTokenResponse } from '@/lib/types/auth';
import { AUTH_ERRORS, COOKIE_KEYS } from '@/lib/constants/auth-constant';
import { BaseResponse } from '@/lib/types/base-response';
export async function POST(req: NextRequest) {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return buildErrorResponse(AUTH_ERRORS.NO_REFRESH_TOKEN, 401);
  }
  // call backend API to refresh tokens
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refreshToken }),
  });

  const data: BaseResponse<RefreshTokenResponse> = await apiRes.json();

  // error from backend // original error
  if (!apiRes.ok) return NextResponse.json(data, { status: 401 });

  const res = NextResponse.json(data, { status: 200 });

  res.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, data.data?.accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: data.data?.accessTokenExpireInMs / 1000,
  });
  res.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, data.data?.refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: data.data?.refreshTokenExpireInMs / 1000,
  });

  res.cookies.set('user_info', JSON.stringify(await getInitialUser()), {
    httpOnly: true,
    path: '/',
    maxAge: data.data?.refreshTokenExpireInMs / 1000,
  });

  return res;
}
