// types/auth.ts

import { BaseResponse } from '@/lib/types/base-response';
import { UserInfo, UserResponse } from '@/lib/types/user';
import { Permission, Role } from '@/lib/types/role';

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
  user: UserInfo | null ;
  roles: Role[],
  permissions: Permission[],
  isLoading: boolean;
  login: (credentials: { email: string; password: string, rememberMe : boolean}) => Promise<BaseResponse<LoginResponse>>;
  signOut: () => Promise<void>;
}
