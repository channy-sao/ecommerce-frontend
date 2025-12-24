// types/auth.ts

import { BaseResponse } from '@/lib/types/base-response';
import { UserResponse } from '@/lib/types/user';

export interface BaseAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpireInMs: number;
  refreshTokenExpireInMs: number;
}

export type RefreshTokenResponse = BaseAuthResponse;


export interface LoginResponse extends BaseAuthResponse {
  userInfo?: UserResponse;
}

export interface AuthContextType {
  user: UserResponse | null ;
  isLoading: boolean;
  login: (credentials: { email: string; password: string, rememberMe : boolean}) => Promise<BaseResponse<LoginResponse>>;
  signOut: () => Promise<void>;
}
