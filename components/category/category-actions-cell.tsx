// components/categories/categories-actions-cell.tsx
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
import {MoreHorizontal} from "lucide-react";
import {CategoryResponse} from "@/lib/types/category-response";
import {EditCategoryDialog} from "@/components/category/edit-category-dialog";

interface CategoryActionsCellProps {
    category: CategoryResponse;
}

export function CategoryActionsCell({category}: CategoryActionsCellProps) {
    const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

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
                    <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        View Category details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {editingCategory && (
                <EditCategoryDialog
                    category={editingCategory}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setEditingCategory(null);
                    }}
                />
            )}
        </>
    );
}