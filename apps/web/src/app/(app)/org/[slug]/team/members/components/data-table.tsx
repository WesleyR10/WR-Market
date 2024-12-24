'use client'

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
} from '@tanstack/react-table'
import { Settings2, SortAsc } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TableFloatingBar } from './table-floating-bar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onTableChange?: (table: ReturnType<typeof useReactTable>) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onTableChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  React.useEffect(() => {
    console.log('table', table)
    console.log('onTableChange', onTableChange)
  }, [table, onTableChange])

  const totalPages = table.getPageCount()

  return (
    <div className="relative">
      <div className="space-y-4">
        {/* Barra de ferramentas superior com busca e ordenação */}
        <div className="flex items-center py-4">
          {/* Campo de busca */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por nome..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>

          {/* Menu de ordenação */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <SortAsc className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => table.getColumn('name')?.toggleSorting(true)}
              >
                Ordenar por Nome
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.getColumn('email')?.toggleSorting(true)}
              >
                Ordenar por Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.getColumn('role')?.toggleSorting(true)}
              >
                Ordenar por Função
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.getColumn('status')?.toggleSorting(true)}
              >
                Ordenar por Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn('joinedDate')?.toggleSorting(true)
                }
              >
                Ordenar por Data de Entrada
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => table.resetSorting()}>
                Resetar Ordenação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu de visibilidade das colunas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Settings2 className="mr-2 h-4 w-4" />
                Visualizar
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <TableUI>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-2'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="cursor-pointer hover:bg-gray-50"
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
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableUI>
        </div>

        {/* Paginação e seleção */}
        <div className="flex items-center justify-between">
          <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} membros selecionados.
          </div>

          <Pagination className="ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => table.setPageIndex(i)}
                    isActive={table.getState().pagination.pageIndex === i}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={
                    !table.getCanNextPage()
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Barra flutuante de ações */}
      <TableFloatingBar table={table} />
    </div>
  )
}
