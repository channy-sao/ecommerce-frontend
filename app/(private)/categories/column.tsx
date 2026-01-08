'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CategoryResponse } from '@/lib/types/category-response';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { CategoryActionsCell } from '@/components/category/category-actions-cell';

export const columns: ColumnDef<CategoryResponse>[] = [
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
    accessorKey: 'createdBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created by" />,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.createdBy?.fullName || '-'}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    enableSorting: true,
  },
  {
    accessorKey: 'updatedBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated By" />,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.updatedBy?.fullName || '-'}</span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    enableSorting: true,
    cell: ({ row }) => row.original.updatedAt || '-',
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      const category = row.original;
      return <CategoryActionsCell category={category} />;
    },
  },
];
