import { Role } from '@wr-market/auth'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoleLabel(role: Role): string {
  const roleMap: Record<Role, string> = {
    ADMIN: 'Admin',
    GERENTE_GERAL: 'Gerente Geral',
    GERENTE_VENDAS: 'Gerente Vendas',
    GERENTE_ESTOQUE: 'Gerente Estoque',
    VENDEDOR: 'Vendedor',
    ESTOQUISTA: 'Estoquista',
    ENTREGADOR: 'Entregador',
  }
  return roleMap[role]
}

export enum MemberStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
}
// Tipo para mapear os status da API para os status da UI
export type APIStatus = 'ACTIVE' | 'INACTIVE'

// Função de conversão atualizada
export function convertStatus(apiStatus: APIStatus): MemberStatus {
  const statusMap: Record<APIStatus, MemberStatus> = {
    ACTIVE: MemberStatus.ACTIVE,
    INACTIVE: MemberStatus.INACTIVE,
  }
  return statusMap[apiStatus]
}
