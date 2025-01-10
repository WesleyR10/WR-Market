import { Role } from '@wr-market/auth'

export const ROLE_HIERARCHY: Record<Role, readonly Role[]> = {
  ADMIN: [
    'GERENTE_GERAL',
    'GERENTE_VENDAS',
    'GERENTE_ESTOQUE',
    'VENDEDOR',
    'ESTOQUISTA',
    'ENTREGADOR',
  ],
  GERENTE_GERAL: [
    'GERENTE_VENDAS',
    'GERENTE_ESTOQUE',
    'VENDEDOR',
    'ESTOQUISTA',
    'ENTREGADOR',
  ],
  GERENTE_VENDAS: ['VENDEDOR'],
  GERENTE_ESTOQUE: ['ESTOQUISTA', 'ENTREGADOR'],
  VENDEDOR: [],
  ESTOQUISTA: [],
  ENTREGADOR: [],
} as const

export function canManageRole(
  currentUserRole: Role | undefined,
  targetRole: Role | undefined,
): boolean {
  if (!currentUserRole || !targetRole) return false
  if (currentUserRole === 'ADMIN') return true

  const allowedRoles = ROLE_HIERARCHY[currentUserRole]
  return allowedRoles?.includes(targetRole) || false
}

type RoleArray = Role[]
type ReadonlyRoleArray = readonly Role[]

// Hierarquia para atribuição de roles
export const ASSIGNABLE_ROLES: Record<Role, ReadonlyRoleArray> = {
  ADMIN: [
    'GERENTE_GERAL',
    'GERENTE_VENDAS',
    'GERENTE_ESTOQUE',
    'VENDEDOR',
    'ESTOQUISTA',
    'ENTREGADOR',
  ],
  GERENTE_GERAL: [
    'GERENTE_VENDAS',
    'GERENTE_ESTOQUE',
    'VENDEDOR',
    'ESTOQUISTA',
    'ENTREGADOR',
  ],
  GERENTE_VENDAS: [], // Não pode atribuir roles
  GERENTE_ESTOQUE: [], // Não pode atribuir roles
  VENDEDOR: [],
  ESTOQUISTA: [],
  ENTREGADOR: [],
} as const

// Nova função para obter roles que podem ser atribuídas
export function getAssignableRoles(
  currentUserRole: Role,
  targetUserRole: Role,
): RoleArray {
  // Se não tem permissão para gerenciar o usuário alvo, retorna array vazio
  if (!canManageRole(currentUserRole, targetUserRole)) {
    return []
  }

  // Se é admin, pode atribuir qualquer role exceto ADMIN
  if (currentUserRole === 'ADMIN') {
    return [...ASSIGNABLE_ROLES.ADMIN]
  }

  // Se é gerente geral, pode atribuir roles abaixo exceto ADMIN e GERENTE_GERAL
  if (currentUserRole === 'GERENTE_GERAL') {
    return [...ASSIGNABLE_ROLES.GERENTE_GERAL]
  }

  // Outros roles não podem atribuir roles
  return []
}
