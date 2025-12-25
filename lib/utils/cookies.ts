'use server';

import {cookies} from 'next/headers';
import "server-only";
import {COOKIE_KEYS} from "@/lib/constants/auth-constant";
import { UserInfo, UserResponse } from '@/lib/types/user';

export async function setAuthCookies(access: string, accessMs: number, refresh: string, refreshMs: number) {
    const store = await cookies();

    store.set(COOKIE_KEYS.ACCESS_TOKEN, access, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: accessMs / 1000
    });

    store.set(COOKIE_KEYS.REFRESH_TOKEN, refresh, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: refreshMs / 1000
    });
}

export async function clearAuthCookies() {
    const store = await cookies();
    store.delete(COOKIE_KEYS.ACCESS_TOKEN);
    store.delete(COOKIE_KEYS.REFRESH_TOKEN);
}

export async function getAccessToken() {
    return (await cookies()).get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

export async function getRefreshToken() {
    return (await cookies()).get(COOKIE_KEYS.REFRESH_TOKEN)?.value ?? null;
}

export async function getInitialUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_info');

  if (!session) return null;

  try {
    return JSON.parse(session.value) as UserInfo;
  } catch {
    return null;
  }
}
