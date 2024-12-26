'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Role } from '@wr-market/auth'
import { ArrowUpDown, Crown, SortAsc } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@/context/UserContext'
import { APIStatus } from '@/lib/utils'
import { canManageRole, getAssignableRoles } from '@/utils/role-hierarchy'

import { TableMember } from './MembersTable'
import { RoleSelect } from './role-select'
import { StatusSwitch } from './status-switch'

export type Member = {
  id: string
  photo: string
  name: string
  email: string
  phone: string
  role: string
  status: APIStatus
  joinedDate: string
}

export const columns = (currentUserRole: Role): ColumnDef<TableMember>[] => [
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
    cell: ({ row }) => {
      const { user: currentUser } = useUser()
      const isCurrentUser = currentUser?.email === row.original.email

      return (
        <div className="flex items-center gap-3">
          <Image
            src={row.original.photo}
            alt={row.getValue('name')}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.getValue('name')}</span>
            {isCurrentUser && (
              <Crown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      )
    },
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
    header: 'Função',
    cell: ({ row }) => {
      const params = useParams()
      const assignableRoles = getAssignableRoles(
        currentUserRole,
        row.original.role,
      )

      // Se não há roles para atribuir, mostra apenas um badge
      if (assignableRoles.length === 0) {
        return <Badge>{row.original.role}</Badge>
      }

      return (
        <RoleSelect
          value={row.getValue('role')}
          orgSlug={params.slug as string}
          memberId={row.original.id}
          userName={row.getValue('name')}
          assignableRoles={assignableRoles}
        />
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const params = useParams()
      const status = row.getValue('status') as APIStatus
      const canManage = canManageRole(currentUserRole, row.original.role)

      if (!canManage) {
        return <Badge>{row.original.status}</Badge>
      }

      return (
        <StatusSwitch
          checked={status === 'ACTIVE'}
          orgSlug={params.slug as string}
          memberId={row.original.id}
          userName={row.getValue('name')}
        />
      )
    },
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
