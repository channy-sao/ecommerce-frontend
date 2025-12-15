"use client";

import { CreateCategoryDialog } from "@/components/category/create-category-dialog";
import { useQuery } from "@tanstack/react-query";
import { CategoryAPI } from "@/lib/api/category";
import {
  CategoryResponse,
  CategoryListResponse,
} from "@/lib/types/category-response";
import { DataTable } from "@/app/(private)/categories/data-table";
import { columns } from "@/app/(private)/categories/column";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function CategoryPage() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const { data } = useQuery<CategoryListResponse>({
    queryKey: ["categories", pageIndex, pageSize, debouncedSearch],
    queryFn: () => CategoryAPI.filter(pageIndex + 1, pageSize, debouncedSearch), // in backend page start from 1
  });

  const categories: CategoryResponse[] = data?.data || [];
  const totalPages = data?.meta.totalPage || 1;
  const totalRecords = data?.meta.totalCount || 0; // Add this line

  return (
    <div className="p-6 space-y-2 bg-card rounded-2xl border-gray-200 border dark:border-gray-800 border-[0.3px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
        <CreateCategoryDialog />
      </div>

      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={categories}
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
