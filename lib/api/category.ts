import { HttpClient } from '@/lib/api-client';
import { CreateCategoryValues } from '../validators/category-schema';

export const CategoryAPI = {
  filter: async (pageIndex: number, pageSize: number, search?: string) => {
    return HttpClient.fetchWithAuth(
      `api/admin/v1/categories?isPaged=true&page=${pageIndex}&pageSize=${pageSize}&filter=${search || ''}`
    );
  },

  getAll: async () => {
    return HttpClient.fetchWithAuth(
      `api/admin/v1/categories?isPaged=false&sortBy=name&sortDirection=ASC`
    );
  },

  create: async (data: CreateCategoryValues) => {
    return HttpClient.fetchWithAuth(`api/admin/v1/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, body: object) => {
    return HttpClient.fetchWithAuth(`api/admin/v1/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
};


export const CATEGORIES_QUERY_KEY = 'categories';
