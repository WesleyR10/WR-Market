'use client'

import { Role } from '@wr-market/auth'
import { Plus, Trash } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'

import { columns } from './columns'
import { DataTable } from './data-table'

export enum MemberStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
}
// Tipo para mapear os status da API para os status da UI
export type APIStatus = 'ACTIVE' | 'INACTIVE'

// Função de conversão atualizada
function convertStatus(apiStatus: APIStatus): MemberStatus {
  const statusMap: Record<APIStatus, MemberStatus> = {
    ACTIVE: MemberStatus.ACTIVE,
    INACTIVE: MemberStatus.INACTIVE,
  }
  return statusMap[apiStatus]
}

// Interface para o membro como vem da API
export interface MemberFromAPI {
  id: string
  userId: string
  role: Role
  status: 'ACTIVE' | 'INACTIVE'
  name: string | null
  email: string
  phone: string | null
  avatarUrl: string | null
}

// Interface para exibição na tabela (sem nullables)
export interface TableMember {
  id: string
  photo: string // Vamos usar um fallback para null
  name: string // Vamos usar um fallback para null
  email: string
  phone: string // Vamos usar um fallback
  role: Role
  status: MemberStatus
  joinedDate: string
}

export interface MembersData {
  members: MemberFromAPI[]
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
  organization: {
    id: string
    __typename: 'Organization'
  }
}

interface MembersTableProps {
  data: MembersData
}

export function MembersTable({ data }: MembersTableProps) {
  const memoizedData = useMemo(() => {
    return data.members.map(
      (member: MemberFromAPI): TableMember => ({
        id: member.id,
        photo: member.avatarUrl || '', // Fallback
        name: member.name || 'Sem nome', // Fallback
        email: member.email,
        phone: member.phone || 'Não informado', // Fallback
        role: member.role,
        status: convertStatus(member.status), // Convertendo o status aqui
        joinedDate: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      }),
    )
  }, [data])
  const memoizedColumns = useMemo(() => columns, [])

  return (
    <div className="px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Membros da Organização</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todos os membros da sua organização em um único
            lugar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Membro
          </Button>
          <Button variant="destructive" size="sm" className="flex items-center">
            <Trash className="mr-2 h-4 w-4" />
            Remover Selecionados
          </Button>
        </div>
      </div>

      <DataTable columns={memoizedColumns} data={memoizedData} />
    </div>
  )
}
