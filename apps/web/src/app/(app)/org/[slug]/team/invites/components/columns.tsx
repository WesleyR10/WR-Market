'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Role } from '@wr-market/auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { getRoleLabel } from '@/lib/utils'

export type Invite = {
  id: string
  email: string
  role: Role
  createdAt: string
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
}

export const columns: ColumnDef<Invite>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    cell: ({ row }) => {
      const role = row.getValue('role') as Role
      return getRoleLabel(role)
    },
  },
  {
    accessorKey: 'author',
    header: 'Convidado por',
    cell: ({ row }) => {
      const author = row.getValue('author') as Invite['author']
      if (!author) return 'N/A'

      console.log('Author completo:', {
        ...author,
        avatarUrl: author.avatarUrl,
      })

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={author.avatarUrl || undefined}
              alt={author.name || ''}
            />
            <AvatarFallback>
              {author.name
                ? author.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                : 'NA'}
            </AvatarFallback>
          </Avatar>
          <span>{author.name || 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data do convite',
    cell: ({ row }) => {
      const dateStr = row.getValue('createdAt') as string
      try {
        const date = new Date(dateStr)
        return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
      } catch (error) {
        console.error('Erro ao formatar data:', error)
        return 'Data inválida'
      }
    },
  },
]
