import { UpdatePasswordRequest } from '@/lib/types/user';
import { HttpClient } from '@/lib/api-client';

export const UserAPI = {
  changePassword: (updateRequest: UpdatePasswordRequest) => {
    return HttpClient.fetchWithAuth('api/v1/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },
};
