import { Decimal } from '@prisma/client/runtime/library'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  PurchaseGetNotAllowedError,
  PurchaseNotFoundError,
} from '@/errors/domain/purchase-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

interface Item {
  id: string
  productId: string
  quantity: number
  price: Decimal
}

export async function getPurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/purchases/:purchaseId',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Get purchase details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            purchaseId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              purchase: z.object({
                id: z.string().uuid(),
                total: z.number(),
                status: z.string(),
                supplierId: z.string().uuid(),
                createdById: z.string().uuid(),
                approvedById: z.string().uuid().nullable(),
                createdAt: z.string(),
                updatedAt: z.string(),
                items: z.array(
                  z.object({
                    id: z.string().uuid(),
                    productId: z.string().uuid(),
                    quantity: z.number().int(),
                    price: z.number(),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, purchaseId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Purchase')) {
          throw new PurchaseGetNotAllowedError()
        }

        const purchase = await prisma.purchase.findUnique({
          where: { id: purchaseId },
          include: {
            items: true,
          },
        })

        if (
          !purchase ||
          purchase.organizationId !== membership.organizationId
        ) {
          throw new PurchaseNotFoundError()
        }
        return reply.send({
          purchase: {
            ...purchase,
            total: purchase.total.toNumber(),
            createdAt: purchase.createdAt.toISOString(),
            updatedAt: purchase.updatedAt.toISOString(),
            items: purchase.items.map((item: Item) => ({
              ...item,
              price: item.price.toNumber(),
            })),
          },
        })
      },
    )
}
