export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  isDeleted: boolean;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleRequest {
  roleName: string;
  description?: string;
  permissionIds: number[];
}