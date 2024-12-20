'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

export type Product = {
  id: string
  rank: number
  name: string
  image: string
  totalBuyers: number
  price: number
  stock: number
  status: boolean
  rating: number
}

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
    cell: ({ row }) => <div className="text-left">{row.getValue('rank')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Produto',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-3">
          <Image
            src={product.image}
            alt={product.name}
            width={100}
            height={100}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-medium">{product.name}</span>
            <span className="text-xs text-muted-foreground">
              ID: {product.id}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalBuyers',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Total Compradores
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const totalBuyers = row.getValue('totalBuyers') as number
      return <div className="text-left">{totalBuyers.toLocaleString()}</div>
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Preço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      return <div className="text-left">${price.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Qtd. Estoque
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      return <div className="text-left">{stock}</div>
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Avaliação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number
      return <div className="text-left">{rating}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as boolean
      return (
        <div className="flex items-center gap-2">
          <Switch checked={status} />
          <span className="text-sm text-muted-foreground">
            {status ? 'Ativado' : 'Desativado'}
          </span>
        </div>
      )
    },
  },
]
