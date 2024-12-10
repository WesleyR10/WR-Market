import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { SaleGetNotAllowedError } from '@/errors/domain/sale-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function listSales(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/sales',
      {
        schema: {
          tags: ['Sales'],
          summary: 'Listar todas as vendas',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            page: z.number().int().positive().default(1).optional(),
            limit: z.number().int().positive().default(10).optional(),
          }),
          response: {
            200: z.object({
              sales: z.array(
                z.object({
                  id: z.string().uuid(),
                  clientId: z.string().uuid(),
                  total: z.number(),
                  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
                  source: z.enum(['ADMIN', 'ECOMMERCE']),
                  createdBy: z.string().uuid().optional(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, page = 1, limit = 10 } = request.params
        const { membership } = await request.getUserMembership(slug)

        const { can } = getUserPermissions(membership.userId, membership.role)
        if (!can('get', 'Sale')) {
          throw new SaleGetNotAllowedError()
        }

        const sales = await prisma.sale.findMany({
          where: {
            organizationId: membership.organizationId,
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.status(200).send({
          sales: sales.map(
            (sale: {
              id: string
              clientId: string
              total: number
              status: string
              source: string
              createdById: string | null
              createdAt: Date
              updatedAt: Date
            }) => ({
              id: sale.id,
              clientId: sale.clientId,
              total: Number(sale.total),
              status: sale.status,
              source: sale.source,
              createdBy: sale.createdById ?? undefined,
              createdAt: sale.createdAt.toISOString(),
              updatedAt: sale.updatedAt.toISOString(),
            }),
          ),
        })
      },
    )
}
