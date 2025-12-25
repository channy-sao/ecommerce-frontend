'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AuthContextType, LoginResponse } from '@/lib/types/auth';
import { BaseResponse } from '@/lib/types/base-response';
import { UserInfo } from '@/lib/types/user';
import { Permission, Role } from '@/lib/types/role';

export const USER_INFO_KEY = 'user_info';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserInfo | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

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
        setRoles(userInfo?.roles || []);
        setPermissions(userInfo?.permissions || []);
        return result;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
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
      setRoles([]);
      setPermissions([]);
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
        roles,
        permissions,
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
