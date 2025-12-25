'use client';
import { RoleAPI, ROLES_QUERY_KEY } from '@/lib/api/role';
import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/lib/types/base-response';
import { Role } from '@/lib/types/role';
import { DataTable } from '@/app/(private)/user-management/roles/data-table';
import { columns } from '@/app/(private)/user-management/roles/column';
import { useState } from 'react';
import { CreateRoleDialog } from '@/components/role/create-role-dialog';

export default function RolesPage() {
  const [search, setSearch] = useState('');
  const { data } = useQuery<BaseResponse<Role[]>>({
    queryFn: () => RoleAPI.getRoles(),
    queryKey: [ROLES_QUERY_KEY],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const roles = data?.data || [];

  return (
    <div className="p-6 space-y-2 bg-card rounded-2xl border-gray-200 border dark:border-gray-800 border-[0.3px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Roles Management</h1>
        <CreateRoleDialog />
      </div>

      {/* Table */}
      <div>
        <DataTable columns={columns} data={roles} search={search} onSearchChange={setSearch} />
      </div>
    </div>
  );
}
