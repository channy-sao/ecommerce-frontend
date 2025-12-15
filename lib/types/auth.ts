// types/auth.ts

import { BaseResponse } from '@/lib/types/base-response';

export interface BaseAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpireInMs: number;
  refreshTokenExpireInMs: number;
}

export type RefreshTokenResponse = BaseAuthResponse;

export interface UserResponse {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse extends BaseAuthResponse {
  userInfo?: UserResponse;
}

export interface AuthContextType {
  user: UserResponse | null ;
  isLoading: boolean;
  login: (credentials: { email: string; password: string, rememberMe : boolean}) => Promise<BaseResponse<LoginResponse>>;
  signOut: () => Promise<void>;
}
