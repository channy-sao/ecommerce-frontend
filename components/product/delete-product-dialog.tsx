// components/products/delete-products-dialog.tsx
"use client";

import { ProductResponse } from "@/lib/types/product-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductApi } from "@/lib/api/product";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteProductDialogProps {
    product: ProductResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({
                                        product,
                                        open,
                                        onOpenChange
                                    }: DeleteProductDialogProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => ProductApi.deleteProduct(id),
        onSuccess: () => {
            toast.success("Product deleted successfully");
            void queryClient.invalidateQueries({ queryKey: ["products"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to delete products");
        },
    });

    const handleDelete = () => {
        if (product) {
            deleteMutation.mutate(product.id);
        }
    };

    if (!product) return null;

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleDelete}
            title="Delete Product"
            description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            confirmText="Delete Product"
            variant="destructive"
            isLoading={deleteMutation.isPending}
        />
    );
}