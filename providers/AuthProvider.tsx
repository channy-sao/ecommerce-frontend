'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AuthContextType, LoginResponse, UserResponse } from '@/lib/types/auth';
import { BaseResponse } from '@/lib/types/base-response';

export const USER_INFO_KEY = 'user_info';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserResponse | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserResponse | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // Login - gets ALL user info directly from Spring Boot
  const login = useCallback(
    async (credentials: { email: string; password: string; rememberMe: boolean }) => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const result: BaseResponse<LoginResponse> = await res.json();
        const userInfo = result.data?.userInfo;
        setUser(userInfo ?? null);
        return result;
      } catch (error: any) {
        console.error('Login error:', error);
        return {
          success: false,
          status: { code: error?.code, message: error?.message },
        } as unknown as BaseResponse<LoginResponse>;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Sign out
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within UserProvider');
  return context;
}
