import { CreateProductSchema } from "@/lib/validators/product-schema";

const API = process.env.NEXT_PUBLIC_BASE_API_URL;

export const ProductApi = {
  filter: async (pageIndex: number, pageSize: number, filter?: string) => {
    const res = await fetch(
      `${API}/api/admin/v1/products/filter?page=${pageIndex}&pageSize=${pageSize}&filter=${filter}`,
    );
    return res.json();
  },
  createProduct: async (productData: CreateProductSchema) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append("name", productData.name);
    formData.append("description", productData.description ?? "");
    formData.append("price", productData.price);
    formData.append("categoryId", productData.categoryId);
    formData.append("isFeature", productData.isFeature.toString());

    // Append image file if exists
    if (productData.image && productData.image instanceof File) {
      formData.append("image", productData.image); // Single file
    }

    const response = await fetch(`${API}/api/admin/v1/products`, {
      method: "POST",
      body: formData, // Send as FormData instead of JSON
      // Don't set Content-Type header - browser will set it automatically with boundary
    });
    console.log("response : " + response);
    return await response.json();
  },

  updateProduct: async (id: number, productData: CreateProductSchema) => {
    // Create FormData object for @ModelAttribute
    const formData = new FormData();

    // Append each field to FormData
    formData.append("name", productData.name);
    formData.append("description", productData.description ?? "");
    formData.append("price", productData.price);
    formData.append("categoryId", productData.categoryId);
    formData.append("isFeature", productData.isFeature.toString());

    // THREE SCENARIOS:
    if (productData.image instanceof File) {
      // Scenario 1: New image - send the file
      formData.append("image", productData.image);
    } else if (productData.image === null) {
      // Scenario 2: Remove image - send empty file
      formData.append("image", new Blob(), "empty.jpg");
    }
    // Scenario 3: No image field = keep existing image

    const response = await fetch(`${API}/api/admin/v1/products/${id}`, {
      method: "PUT",
      body: formData, // Send as FormData instead of JSON
      // Don't set Content-Type header - browser will set it automatically with boundary
    });
    console.log("response : " + response);
    return await response.json();
  },

  deleteProduct: async (id: number) => {
    const response = await fetch(`${API}/api/admin/v1/products/${id}`, {
      method: "DELETE",
    });
    console.log("response : " + response);
    return await response.json();
  },
};
