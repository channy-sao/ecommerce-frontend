'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Permission, Role } from '@/lib/types/role';
import { Badge } from '@/components/ui/badge';
import { RoleActionsCell } from '@/components/role/role-actions-cell';
import { BadgeCheckIcon, BadgeIcon } from 'lucide-react';

export const columns: ColumnDef<Role>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.description || '-'}</span>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'permissions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
    enableSorting: false, // Usually don't sort permissions
    cell: ({ row }) => {
      const permissions: Permission[] = row.original.permissions;

      if (!permissions || permissions.length === 0) {
        return (
          <span className="text-muted-foreground text-sm text-red-400"> ~ No permission ~</span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-md">
          {permissions.map((permission, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="font-normal text-[11px] bg-sidebar-menu text-sidebar-menu-foreground"
            >
              {permission.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isActive = !row.original.isDeleted || false;
      return isActive ? (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
          <BadgeCheckIcon />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="bg-blue-500 text-white dark:bg-blue-600">
          <BadgeIcon />
          Inactive
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const role = row.original;
      return <RoleActionsCell role={role} />;
    },
  },
];
