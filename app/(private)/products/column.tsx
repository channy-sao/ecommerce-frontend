'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { ProductResponse } from '@/lib/types/product-response';
import Image from 'next/image';
import { ProductActionsCell } from '@/components/product/product-actions-cell';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';

export const columns: ColumnDef<ProductResponse>[] = [
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
    accessorKey: 'image',
    header: 'Picture',
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      const productName = row.original.name;

      return (
        <div className="w-12 h-12 rounded-md overflow-hidden items-center justify-center">
          {imageUrl ? (
            <ImagePreviewDialog imageUrl={imageUrl} alt={productName}>
              <Image
                src={imageUrl}
                alt={productName}
                width={48}
                height={48}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </ImagePreviewDialog>
          ) : (
            <div className="text-gray-400 text-xs">N/A</div>
          )}
        </div>
      );
    },
    enableSorting: false,
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
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.original.price;
      return <span className="font-semibold text-foreground">${value}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },

  {
    accessorKey: 'isFeature',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'createdBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created by" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.createdBy?.fullName || '-'}</span>
    ),
    enableSorting: true,
    enableHiding: true,
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
      const productResponse = row.original;

      return <ProductActionsCell product={productResponse} />;
    },
  },
];
