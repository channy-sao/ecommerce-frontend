import { HttpClient } from '@/lib/api-client';
import { BaseResponse } from '@/lib/types/base-response';
import { Permission } from '@/lib/types/role';

export const PermissionAPI = {
  getPermissions: (): Promise<BaseResponse<Permission[]>> => {
    return HttpClient.fetchWithAuth('api/admin/v1/permissions', {
      method: 'GET',
    });
  },
};

export const PERMISSIONS_QUERY_KEY = 'permissions';