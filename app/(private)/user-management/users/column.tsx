'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { RoleActionsCell } from '@/components/role/role-actions-cell';
import { BadgeCheckIcon, BadgeIcon } from 'lucide-react';
import { UserResponse } from '@/lib/types/user';
import { Role } from '@/lib/types/role';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import Image from 'next/image';
import { UserActionsCell } from '@/components/user/user-actions-cell';

export const columns: ColumnDef<UserResponse>[] = [
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
    accessorKey: "image",
    header: "Picture",
    cell: ({ row }) => {
      const imageUrl = row.original.avatar;
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
          {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageUrl}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
          ) : (
            <Image
              src={"/images/no-image.png"}
              alt={"No image"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: true,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    enableSorting: true,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone || '~'}</span>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Roles" />,
    enableSorting: false, // Usually don't sort permissions
    cell: ({ row }) => {
      const roles: Role[] = row.original.roles;

      if (!roles || roles.length === 0) {
        return (
          <span className="text-muted-foreground text-sm text-red-400"> ~ No Roles ~ </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-md">
          {roles.map((role, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="font-normal text-[11px] bg-sidebar-menu text-sidebar-menu-foreground"
            >
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    enableSorting: true,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return isActive ? (
        <Badge variant="secondary" className="bg-green-500 text-white dark:bg-green-600">
          <BadgeCheckIcon />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="bg-red-500 text-white dark:bg-red-600">
          <BadgeIcon />
          Inactive
        </Badge>
      );
    },
    enableGlobalFilter: true,
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => {
      const user = row.original;
       return <UserActionsCell user={user} />;
    },
  },
];
