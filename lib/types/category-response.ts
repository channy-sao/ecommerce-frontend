import { BaseResponse } from "@/lib/types/base-response";
import { AuditUser } from '@/lib/types/user';

export type CategoryResponse = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: AuditUser;
  updatedAt: string;
  updatedBy?: AuditUser;
  products: [];
};

// Response type for listing categories
export type CategoryListResponse = BaseResponse<CategoryResponse[]>;
