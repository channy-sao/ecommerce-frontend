import { HttpClient } from '@/lib/api-client';
import { BaseResponse } from '@/lib/types/base-response';
import { CreateRoleRequest, Role, UpdateRoleRequest } from '@/lib/types/role';

export const RoleAPI = {
  getRoles: (): Promise<BaseResponse<Role[]>> => {
    return HttpClient.fetchWithAuth('api/admin/v1/roles', {
      method: 'GET',
    });
  },
  createRole: async (role: CreateRoleRequest): Promise<BaseResponse<null>> => {
    return HttpClient.fetchWithAuth('api/admin/v1/roles', {
      method: 'POST',
      body: JSON.stringify(role),
    });
  },

  updateRole: async (update: UpdateRoleRequest, roleId: number): Promise<BaseResponse<null>> => {
    return HttpClient.fetchWithAuth(`api/admin/v1/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  },
};

export const ROLES_QUERY_KEY = 'roles';