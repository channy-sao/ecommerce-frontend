"use client";

import {CreateCategoryDialog} from "@/components/category/create-category-dialog";
import {DataTable} from "@/app/products/data-table";
import {columns} from "@/app/products/column";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {ProductListResponse, ProductResponse} from "@/lib/types/product-response";
import {ProductApi} from "@/lib/api/product";
import {CreateProductDialog} from "@/components/product/create-product-dialog";
import {useDebounce} from "@/hooks/use-debounce";


export default function ProductPage() {

    const [pageIndex, setPageIndex] = useState(0); // 0-based
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 1000);

    const {data, isLoading, isError} = useQuery<ProductListResponse>({
        queryKey: ["products", pageIndex, pageSize, debouncedSearch],
        queryFn: () => ProductApi.filter(pageIndex + 1, pageSize, debouncedSearch), // in backend page start from 1
    });


    const products: ProductResponse[] = data?.data || [];
    const totalPages = data?.meta.totalPage || 1;
    const totalRecords = data?.meta.totalCount || 0; // Add this line

    return (
        <div className="w-full p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Product Management</h1>
                <CreateProductDialog/>
            </div>

            <div className={"overflow-x-auto"}>
                <DataTable
                    columns={columns} data={products} pageCount={totalPages}
                    hiddenColumns={["createdAt", "createdBy", "updatedAt", "updatedBy"]}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalRecord={totalRecords}
                    search={search} onSearchChange={setSearch}
                    setPageIndex={setPageIndex}
                    setPageSize={setPageSize}/>
            </div>
        </div>
    );
}