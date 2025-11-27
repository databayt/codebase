"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table as TableType,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Context
interface DataTableContextValue<TData> {
  table: TableType<TData>
  columns: ColumnDef<TData, unknown>[]
}

const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null)

export function useDataTableContext<TData>() {
  const context = React.useContext(DataTableContext) as DataTableContextValue<TData> | null
  if (!context) {
    throw new Error("useDataTableContext must be used within a DataTable component")
  }
  return context
}

// Root Component
export interface DataTableProps<TData, TValue> extends React.ComponentProps<typeof Card> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  children?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  className,
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const contextValue = React.useMemo<DataTableContextValue<TData>>(
    () => ({
      table,
      columns: columns as ColumnDef<TData, unknown>[],
    }),
    [table, columns]
  )

  return (
    <DataTableContext.Provider value={contextValue as DataTableContextValue<unknown>}>
      <Card
        data-slot="data-table"
        className={cn("shadow-none border", className)}
        {...props}
      >
        {children}
      </Card>
    </DataTableContext.Provider>
  )
}

// Header Component
export interface DataTableHeaderProps extends React.ComponentProps<typeof CardHeader> {
  title?: string
  description?: string
}

export function DataTableHeader({
  title,
  description,
  children,
  className,
  ...props
}: DataTableHeaderProps) {
  return (
    <CardHeader data-slot="data-table-header" className={className} {...props}>
      {title && <CardTitle className="text-xl">{title}</CardTitle>}
      {description && <CardDescription>{description}</CardDescription>}
      {children}
    </CardHeader>
  )
}

// Content Wrapper
export interface DataTableContentProps extends React.ComponentProps<typeof CardContent> {}

export function DataTableContent({
  children,
  className,
  ...props
}: DataTableContentProps) {
  return (
    <CardContent data-slot="data-table-content" className={className} {...props}>
      {children}
    </CardContent>
  )
}

// Toolbar Component
export interface DataTableToolbarProps extends React.ComponentProps<"div"> {
  filterColumn?: string
  filterPlaceholder?: string
  showColumnToggle?: boolean
}

export function DataTableToolbar({
  filterColumn,
  filterPlaceholder = "Filter...",
  showColumnToggle = true,
  children,
  className,
  ...props
}: DataTableToolbarProps) {
  const { table } = useDataTableContext()

  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("mb-4 flex items-center gap-4", className)}
      {...props}
    >
      {filterColumn && (
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      )}
      {children}
      {showColumnToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// Body Component
export interface DataTableBodyProps extends React.ComponentProps<"div"> {
  emptyMessage?: string
}

export function DataTableBody({
  emptyMessage = "No results.",
  className,
  ...props
}: DataTableBodyProps) {
  const { table, columns } = useDataTableContext()

  return (
    <div
      data-slot="data-table-body"
      className={cn("overflow-hidden rounded-md border", className)}
      {...props}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="[&:has([role=checkbox])]:pl-3"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
                  <TableCell
                    key={cell.id}
                    className="[&:has([role=checkbox])]:pl-3"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
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
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Pagination Component
export interface DataTablePaginationProps extends React.ComponentProps<"div"> {
  showSelected?: boolean
}

export function DataTablePagination({
  showSelected = true,
  className,
  ...props
}: DataTablePaginationProps) {
  const { table } = useDataTableContext()

  return (
    <div
      data-slot="data-table-pagination"
      className={cn("flex items-center justify-end space-x-2 pt-4", className)}
      {...props}
    >
      {showSelected && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

// Column Header Helper (for sortable columns)
export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof Button> {
  column: import("@tanstack/react-table").Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <Button
      data-slot="data-table-column-header"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={className}
      {...props}
    >
      {title}
      <ArrowUpDown />
    </Button>
  )
}

// Export all components
export {
  DataTable as DataTableRoot,
  DataTableHeader,
  DataTableContent,
  DataTableToolbar,
  DataTableBody,
  DataTablePagination,
  DataTableColumnHeader,
}
