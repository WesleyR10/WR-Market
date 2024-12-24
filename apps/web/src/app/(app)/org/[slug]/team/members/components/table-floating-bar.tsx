'use client'

import { Table } from '@tanstack/react-table'
import { Download, Edit, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface TableFloatingBarProps<TData> {
  table: Table<TData>
}

export function TableFloatingBar<TData>({
  table,
}: TableFloatingBarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  if (selectedRows === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg border bg-background px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {selectedRows}{' '}
          {selectedRows === 1 ? 'membro selecionado' : 'membros selecionados'}
        </span>

        <div className="h-4 w-[1px] bg-muted" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8">
            <Download className="mr-1.5 h-4 w-4" />
            Baixar CV
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Edit className="mr-1.5 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-500 hover:text-red-600"
          >
            <Trash className="mr-1.5 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}
