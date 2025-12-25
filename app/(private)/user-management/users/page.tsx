'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/lib/types/base-response';
import { DataTable } from '@/app/(private)/user-management/users/data-table';
import { columns } from '@/app/(private)/user-management/users/column';
import { useDebounce } from '@/hooks/use-debounce';
import { UserResponse } from '@/lib/types/user';
import { UserAPI, USERS_QUERY_KEY } from '@/lib/api/user';
import { CreateUserDialog } from '@/components/user/create-user-dialog';
import { ApiError } from '@/lib/http';
import { toast } from 'sonner';

export default function UsersPage() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 1000);

  const { data, error, isError } = useQuery<BaseResponse<UserResponse[]>>({
    queryKey: [USERS_QUERY_KEY, pageIndex, pageSize, debouncedSearch],
    queryFn: () => UserAPI.getUsers(pageIndex + 1, pageSize, debouncedSearch), // in backend page start from 1
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const users: UserResponse[] = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;
  const totalRecords = data?.meta?.totalCount || 0; // Add this line

  useEffect(() => {
    if (isError && error instanceof ApiError) {
      switch (error.status) {
        case 401:
          toast.error('Session expired. Please login again.');
          break;

        case 403:
          toast.error('Access denied');
          break;

        default:
          toast.error(error.message);
      }
    }
  });

  return (
    <div className="p-6 space-y-2 bg-card rounded-2xl border-gray-200 border dark:border-gray-800 border-[0.3px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">User Management</h1>
        <CreateUserDialog />
      </div>

      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={users}
          pageCount={totalPages}
          search={search}
          onSearchChange={setSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRecord={totalRecords}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}
