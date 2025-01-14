import { Prisma } from '@prisma/client'
import { purchaseSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  PurchaseDeleteNotAllowedError,
  PurchaseNotFoundError,
} from '@/errors/domain/purchase-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deletePurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/purchases/:purchaseId',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Delete a purchase',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            purchaseId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, purchaseId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const purchase = await prisma.purchase.findUnique({
          where: { id: purchaseId },
          select: {
            id: true,
            total: true,
            status: true,
            supplierId: true,
            createdById: true,
            approvedById: true,
            organizationId: true,
          },
        })

        if (!purchase) {
          throw new PurchaseNotFoundError()
        }

        const Purchase = purchaseSchema.parse({
          __typename: 'Purchase',
          id: purchase.id,
          organizationId: purchase.organizationId,
        })
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', Purchase)) {
          throw new PurchaseDeleteNotAllowedError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          await tx.purchaseItem.deleteMany({
            where: { purchaseId },
          })

          await tx.purchase.delete({
            where: { id: purchaseId },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'DELETE',
              entity: 'Purchase',
              entityId: purchaseId,
              changes: {
                old: Purchase,
                new: null,
              },
              createdAt: dateUtils.toDate(new Date()),
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
