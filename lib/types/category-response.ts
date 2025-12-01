import {BaseResponse} from "@/lib/types/base-response";

export type CategoryResponse = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    products : []

};

// Response type for listing categories
export type CategoryListResponse = BaseResponse<CategoryResponse[]>;