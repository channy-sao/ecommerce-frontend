// components/products/products-actions-cell.tsx
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ProductResponse } from '@/lib/types/product-response';
import { EditProductDialog } from '@/components/product/edit-product-dialog';
import { DeleteProductDialog } from '@/components/product/delete-product-dialog';
import DetailProductDialog from '@/components/product/detail-product-dialog';

interface ProductActionsCellProps {
  product: ProductResponse;
}

export function ProductActionsCell({ product }: ProductActionsCellProps) {
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductResponse | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProductResponse | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant={'custom-blue'} onClick={() => setEditingProduct(product)}>
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeletingProduct(product)} variant={'custom-blue'}>
            Delete Product
          </DropdownMenuItem>
          <DropdownMenuItem variant={'custom-blue'} onClick={() => setDetailProduct(product)}>
            Product details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeletingProduct(null);
          }}
        />
      )}

      {detailProduct && (
        <DetailProductDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setDetailProduct(null);
          }}
        />
      )}
    </>
  );
}
