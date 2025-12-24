import {
  AssignRoleToUserRequest,
  CreateUserRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/lib/types/user';
import { HttpClient } from '@/lib/api-client';
import { UpdateUserFormValues } from '@/lib/validators/user-schema';

export const UserAPI = {
  changePassword: (updateRequest: UpdatePasswordRequest) => {
    return HttpClient.fetchWithAuth('api/v1/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },
  getUsers: (pageIndex: number, pageSize: number, filter: string) => {
    return HttpClient.fetchWithAuth(
      `api/v1/users?page=${pageIndex}&pageSize=${pageSize}&filter=${filter}`,
      {
        method: 'GET',
      }
    );
  },

  createUser: (user: CreateUserRequest) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('firstName', user.firstName ?? '');
    formData.append('lastName', user.lastName ?? '');
    formData.append('phone', user.phone ?? '');

    if (user.profile && user.profile instanceof File) {
      // Scenario 1: New image - send the file
      formData.append('profile', user.profile);
    }

    return HttpClient.fetchWithAuth(`api/v1/users`, {
      method: 'POST',
      body: formData,
    });
  },

  updateUser: (user: UpdateUserRequest, userId: number) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('firstName', user.firstName ?? '');
    formData.append('lastName', user.lastName ?? '');
    formData.append('phone', user.phone ?? '');

    // THREE SCENARIOS:
    if (user.profile && user.profile instanceof File) {
      // Scenario 1: New image - send the file
      formData.append('profile', user.profile);
    } else if (user.profile === null) {
      // Scenario 2: Remove image - send empty file
      formData.append('profile', new Blob(), 'empty.jpg');
    }

    return HttpClient.fetchWithAuth(`api/v1/users/${userId}`, {
      method: 'PUT',
      body: formData,
    });
  },

  assignRole: (user: AssignRoleToUserRequest, userId: number) => {
    return HttpClient.fetchWithAuth(`api/v1/users/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  updateStatus: (status: boolean, userId: number) => {
    return HttpClient.fetchWithAuth(`api/v1/users/${userId}/status?status=${status}`, {
      method: 'PATCH',
    });
  },

  deleteUser: (userId: number) => {
    return HttpClient.fetchWithAuth(`api/v1/users/${userId}`, {
      method: 'DELETE',
    });
  },


};

export const USERS_QUERY_KEY = 'users';