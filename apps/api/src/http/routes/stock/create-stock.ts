import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  StockCreateNotAllowedError,
  StockNotFoundError,
} from '@/errors/domain/stock-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createStock(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/stocks',
      {
        schema: {
          tags: ['Stock'],
          summary: 'Create a new stock entry',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive(),
          }),
          response: {
            201: z.object({
              stockId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { productId, quantity } = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Stock')) {
          throw new StockCreateNotAllowedError()
        }

        // Verify that the product exists and belongs to the organization
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })

        if (!product || product.organizationId !== membership.organizationId) {
          throw new StockNotFoundError()
        }

        const stock = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const created = await tx.stock.create({
              data: {
                productId,
                quantity,
                organizationId: membership.organizationId,
                memberId: membership.id,
              },
            })

            await tx.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Stock',
                entityId: created.id,
                changes: {
                  productId,
                  quantity,
                  organizationId: membership.organizationId,
                },
                createdAt: new Date(),
              },
            })

            return created
          },
        )

        return reply.status(201).send({
          stockId: stock.id,
        })
      },
    )
}
