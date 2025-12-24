import { CreateProductSchema } from '@/lib/validators/product-schema';
import { HttpClient } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_BASE_API_URL;

export const ProductApi = {
  filter: async (pageIndex: number, pageSize: number, filter?: string) => {
    return HttpClient.fetchWithAuth(
      `api/admin/v1/products/filter?page=${pageIndex}&pageSize=${pageSize}&filter=${filter}`
    );
  },
  createProduct: async (productData: CreateProductSchema) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append('name', productData.name);
    formData.append('description', productData.description ?? '');
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('isFeature', productData.isFeature.toString());

    // Append image file if exists
    if (productData.image && productData.image instanceof File) {
      formData.append('image', productData.image); // Single file
    }

    return HttpClient.fetchWithAuth(`api/admin/v1/products`, {
      method: 'POST',
      body: formData, // Send as FormData instead of JSON
    });
  },

  updateProduct: async (id: number, productData: CreateProductSchema) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append('name', productData.name);
    formData.append('description', productData.description ?? '');
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('isFeature', productData.isFeature.toString());

    // THREE SCENARIOS:
    if (productData.image instanceof File) {
      // Scenario 1: New image - send the file
      formData.append('image', productData.image);
    } else if (productData.image === null) {
      // Scenario 2: Remove image - send empty file
      formData.append('image', new Blob(), 'empty.jpg');
    }
    // Scenario 3: No image field = keep existing image

    return HttpClient.fetchWithAuth(`api/admin/v1/products/${id}`, {
      method: 'PUT',
      body: formData, // Send as FormData instead of JSON
      // Don't set Content-Type header - browser will set it automatically with boundary
    });
  },

  deleteProduct: async (id: number) => {
    return HttpClient.fetchWithAuth(`api/admin/v1/products/${id}`, {
      method: 'DELETE',
    });
  },
};

export const PRODUCTS_QUERY_KEY = 'products';
