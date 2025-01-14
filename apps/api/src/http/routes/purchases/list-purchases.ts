import { PurchaseStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { PurchaseGetNotAllowedError } from '@/errors/domain/purchase-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

interface Purchase {
  id: string
  total: Decimal
  status: string
  supplierId: string
  createdAt: Date
  updatedAt: Date
}

export async function listPurchases(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'List all purchases',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            perPage: z.coerce.number().min(1).max(100).default(20),
            status: z.string().optional(),
            supplierId: z.string().uuid().optional(),
          }),
          response: {
            200: z.object({
              purchases: z.array(
                z.object({
                  id: z.string().uuid(),
                  total: z.number(),
                  status: z.string(),
                  supplierId: z.string().uuid(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              ),
              pagination: z.object({
                page: z.number(),
                perPage: z.number(),
                total: z.number(),
                totalPages: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)
        const { page, perPage, status, supplierId } = request.query

        const { cannot } = getUserPermissions(
          await request.getCurrentUserId(),
          membership.role,
        )

        if (cannot('get', 'Purchase')) {
          throw new PurchaseGetNotAllowedError()
        }

        const [purchases, total] = await Promise.all([
          prisma.purchase.findMany({
            where: {
              organizationId: membership.organizationId,
              ...(status && { status: status as PurchaseStatus }),
              ...(supplierId && { supplierId }),
            },
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.purchase.count({
            where: {
              organizationId: membership.organizationId,
              ...(status && { status: status as PurchaseStatus }),
              ...(supplierId && { supplierId }),
            },
          }),
        ])

        return reply.send({
          purchases: purchases.map((purchase: Purchase) => ({
            ...purchase,
            createdAt: dateUtils.toISO(purchase.createdAt),
            updatedAt: dateUtils.toISO(purchase.updatedAt),
            total: purchase.total.toNumber(),
          })),
          pagination: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
          },
        })
      },
    )
}
