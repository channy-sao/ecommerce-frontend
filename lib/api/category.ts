import {CreateCategoryValues} from "../validators/category-schema";

const API = process.env.NEXT_PUBLIC_BASE_API_URL;

export const CategoryAPI = {
    filter: async (pageIndex: number, pageSize: number, search?: string) => {
        const res = await fetch(`${API}/api/v1/categories?isPaged=true&page=${pageIndex}&pageSize=${pageSize}&filter=${search}`);
        return res.json();
    },

    getAll: async () => {
        const res = await fetch(`${API}/api/v1/categories?isPaged=false&sortBy=name&sortDirection=ASC`);
        return res.json();
    },

    create: async (data: CreateCategoryValues) => {
        const res = await fetch(`${API}/api/v1/categories`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Create failed");
        return res.json();
    },

    update: async (id: number, body: object) => {
        const res = await fetch(`${API}/api/v1/categories/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        return res.json();
    },
};
