export type BaseResponse<T> = {
  success: boolean;
  data: T;
  meta: {
    totalPage: number;
    page: number;
    totalCount: number;
    pageSize: number;
  };
  status: {
    code: number;
    message: string;
  };
  timestamp: string;
  traceId: string;
  path: string;
};
