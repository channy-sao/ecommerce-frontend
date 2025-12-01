// components/products/products-actions-cell.tsx
"use client";

import {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, Eye, MoreHorizontal, Trash} from "lucide-react";
import {ProductResponse} from "@/lib/types/product-response";
import {EditProductDialog} from "@/components/product/edit-product-dialog";
import {DeleteProductDialog} from "@/components/product/delete-product-dialog";
import DetailProductDialog from "@/components/product/detail-product-dialog";

interface ProductActionsCellProps {
    product: ProductResponse;
}

export function ProductActionsCell({product}: ProductActionsCellProps) {
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<ProductResponse | null>(null);
    const [detailProduct, setDetailProduct] = useState<ProductResponse | null>(null);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4"/> Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setDeletingProduct(product)}
                        className="flex items-center gap-2 text-red-600"
                    >
                        <Trash className="h-4 w-4"/> Delete Product
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => setDetailProduct(product)}>
                        <Eye className="h-4 w-4"/> Product details
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

            {
                detailProduct && (
                    <DetailProductDialog open={true} onOpenChange={(open) => {
                        if (!open) setDetailProduct(null)
                    }}/>
                )
            }
        </>
    );
}