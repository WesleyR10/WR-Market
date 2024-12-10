import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  StockDeleteNotAllowedError,
  StockNotFoundError,
} from '@/errors/domain/stock-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteStock(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/stocks/:stockId',
      {
        schema: {
          tags: ['Stock'],
          summary: 'Delete a stock entry',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            stockId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, stockId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Stock')) {
          throw new StockDeleteNotAllowedError()
        }

        const stock = await prisma.stock.findUnique({
          where: { id: stockId },
        })

        if (!stock || stock.organizationId !== membership.organizationId) {
          throw new StockNotFoundError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          await tx.stock.delete({
            where: { id: stockId },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'DELETE',
              entity: 'Stock',
              entityId: stockId,
              changes: {
                old: stock,
                new: null,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
