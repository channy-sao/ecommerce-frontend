import { BaseResponse } from "@/lib/types/base-response";
import { AuditUser } from '@/lib/types/user';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  categoryName: string;
  isFeature: boolean;
  createdAt: string; // or Date if you want
  updatedAt: string; // or Date if you want
  createdBy: AuditUser;
  updatedBy?: AuditUser;
}

export type ProductListResponse = BaseResponse<ProductResponse[]>;
