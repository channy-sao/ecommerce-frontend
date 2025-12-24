import { Permission, Role } from '@/lib/types/role';

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  email: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  roles: Role[];
  permissions: Permission[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: File;
}


export interface UpdateUserRequest {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: File;
}

export interface UpdateUserResponse {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: File;
}

export interface AssignRoleToUserRequest {
  roleIds: number[];
}
