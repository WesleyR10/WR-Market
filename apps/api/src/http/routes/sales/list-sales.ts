import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { SaleGetNotAllowedError } from '@/errors/domain/sale-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
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
          }),
          querystring: z.object({
            page: z.coerce.number().int().min(1).default(1).optional(),
            limit: z.coerce
              .number()
              .int()
              .min(1)
              .max(100)
              .default(10)
              .optional(),
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
              pagination: z.object({
                page: z.number().int(),
                perPage: z.number().int(),
                total: z.number().int(),
                totalPages: z.number().int(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { page = 1, limit = 10 } = request.query
        const { membership } = await request.getUserMembership(slug)

        const { can } = getUserPermissions(membership.userId, membership.role)
        if (!can('get', 'Sale')) {
          throw new SaleGetNotAllowedError()
        }

        const total = await prisma.sale.count({
          where: {
            organizationId: membership.organizationId,
          },
        })

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
          sales: sales.map((sale) => ({
            id: sale.id,
            clientId: sale.clientId,
            total: sale.total.toNumber(),
            status: sale.status,
            source: sale.source,
            createdBy: sale.createdById ?? undefined,
            createdAt: dateUtils.toISO(sale.createdAt),
            updatedAt: dateUtils.toISO(sale.updatedAt),
          })),
          pagination: {
            page,
            perPage: limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        })
      },
    )
}
