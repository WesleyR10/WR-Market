'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, SortAsc } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { StatusBadge } from './status-badge'

export type Member = {
  id: string
  photo: string
  name: string
  email: string
  phone: string
  role: string
  status: 'Ativo' | 'Inativo' | 'Pendente'
  joinedDate: string
}

export const columns: ColumnDef<Member>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Usuário
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <SortAsc className="ml-2 h-4 w-4 rotate-180" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.photo}
          alt={row.getValue('name')}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="font-medium">{row.getValue('name')}</div>
      </div>
    ),
    filterFn: 'includesString',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Email
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <SortAsc className="ml-2 h-4 w-4 rotate-180" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => <div className="text-sm ">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Função
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <SortAsc className="ml-2 h-4 w-4 rotate-180" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className="bg-indigo-100 text-indigo-800">
        {row.getValue('role')}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Status
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <SortAsc className="ml-2 h-4 w-4 rotate-180" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'joinedDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Data de Entrada
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <SortAsc className="ml-2 h-4 w-4 rotate-180" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm ">{row.getValue('joinedDate')}</div>
    ),
  },
]
