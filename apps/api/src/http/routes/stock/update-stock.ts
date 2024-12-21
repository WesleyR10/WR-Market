import { Prisma } from '@prisma/client'
import { stockSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  StockNotFoundError,
  StockUpdateNotAllowedError,
} from '@/errors/domain/stock-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateStock(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/stocks/:stockId',
      {
        schema: {
          tags: ['Stock'],
          summary: 'Update stock details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            stockId: z.string().uuid(),
          }),
          body: z.object({
            quantity: z.number().int().positive().optional(),
            productId: z.string().uuid().optional(),
          }),
          response: {
            204: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, stockId } = request.params
        const updateData = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const stock = await prisma.stock.findUnique({
          where: { id: stockId },
        })

        if (!stock || stock.organizationId !== membership.organizationId) {
          throw new StockNotFoundError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        const authStock = stockSchema.parse(stock)

        if (cannot('update', authStock)) {
          throw new StockUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const updated = await tx.stock.update({
            where: { id: stockId },
            data: updateData,
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Stock',
              entityId: stockId,
              changes: {
                old: stock,
                new: updated,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send({
          message: 'Estoque atualizado com sucesso',
        })
      },
    )
}
