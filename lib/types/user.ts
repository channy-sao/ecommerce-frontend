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

export interface UserInfo {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
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

export interface AuditUser {
  id: number;
  fullName: string;
}

export interface AssignRoleToUserRequest {
  roleIds: number[];
}


export function mapToUserInfo(user: UserResponse): UserInfo {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    phone: user.phone,
    avatar: user.avatar,
    isActive: user.isActive,
  };
}