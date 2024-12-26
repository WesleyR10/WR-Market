import { Role } from '@wr-market/auth'
import { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
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
  GERENTE_ESTOQUE: ['ESTOQUISTA'],
  VENDEDOR: [],
  ESTOQUISTA: [],
  ENTREGADOR: [],
} as const

declare module 'fastify' {
  interface FastifyRequest {
    canManageRole(
      currentRole: Role | null | undefined,
      targetRole: Role | null | undefined,
    ): boolean
  }
}

export const roleHierarchyMiddleware = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook('preHandler', async (request) => {
      request.canManageRole = (
        currentRole: Role | null | undefined,
        targetRole: Role | null | undefined,
      ): boolean => {
        if (!currentRole || !targetRole) return false
        if (currentRole === 'ADMIN') return true

        const allowedRoles = ROLE_HIERARCHY[currentRole as Role]
        return allowedRoles?.includes(targetRole as Role) || false
      }
    })
  },
)
