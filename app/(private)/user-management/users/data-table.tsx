"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Search } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // server-side pagination props
  pageIndex: number;
  pageSize: number;
  pageCount: number;

  totalRecord?: number;

  search: string;
  onSearchChange: (search: string) => void;

  // Add hiddenColumns prop to specify which columns should be hidden by default
  hiddenColumns?: string[];

  setPageIndex: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data,
                                           pageIndex,
                                           pageSize,
                                           pageCount,
                                           // Add hiddenColumns prop to specify which columns should be hidden by default
                                           hiddenColumns = [],
                                           totalRecord,
                                           search,
                                           onSearchChange,
                                           setPageIndex,
                                           setPageSize,
                                         }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [globalFilter, setGlobalFilter] = React.useState("");

  // Initialize column visibility - hide columns specified in hiddenColumns
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      const initialVisibility: VisibilityState = {};

      // Set columns specified in hiddenColumns to be hidden by default
      hiddenColumns.forEach((columnId) => {
        initialVisibility[columnId] = false;
      });

      return initialVisibility;
    });

  const [rowSelection, setRowSelection] = React.useState({});
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (update) => {
      const next =
        typeof update === "function" ? update({ pageIndex, pageSize }) : update;

      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {/* Global Search - searches name, categories, description */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, category, description..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ArrowDownUp className={'w-4 h-4'} />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-2">
        <DataTablePagination table={table} totalRecords={totalRecord} />
      </div>
    </div>
  );
}
