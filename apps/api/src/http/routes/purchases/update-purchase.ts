import { Prisma } from '@prisma/client'
import { purchaseSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  PurchaseNotFoundError,
  PurchaseUpdateNotAllowedError,
} from '@/errors/domain/purchase-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updatePurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/purchases/:purchaseId',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Update purchase details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            purchaseId: z.string().uuid(),
          }),
          body: z.object({
            status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
            supplierId: z.string().uuid().optional(),
            items: z
              .array(
                z.object({
                  productId: z.string().uuid(),
                  quantity: z.number().int().positive(),
                  price: z.number().positive(),
                }),
              )
              .optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, purchaseId } = request.params
        const updateData = request.body

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

        if (
          !purchase ||
          purchase.organizationId !== membership.organizationId
        ) {
          throw new PurchaseNotFoundError()
        }
        const Purchase = purchaseSchema.parse({
          __typename: 'Purchase',
          id: purchase.id,
          organizationId: purchase.organizationId,
        })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', Purchase)) {
          throw new PurchaseUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const updated = await tx.purchase.update({
            where: { id: purchaseId },
            data: {
              ...updateData,
              updatedAt: new Date(),
              items: updateData.items
                ? {
                    updateMany: updateData.items.map(
                      (item: {
                        productId: string
                        quantity: number
                        price: number
                      }) => ({
                        where: { productId: item.productId },
                        data: {
                          quantity: item.quantity,
                          price: new Prisma.Decimal(item.price),
                        },
                      }),
                    ),
                  }
                : undefined,
            },
          })

          // Se itens forem atualizados
          if (updateData.items) {
            // Opcional: Implementar lógica para sincronização de PurchaseItems
            // Pode envolver deleção, atualização e criação conforme necessário
          }

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Purchase',
              entityId: purchaseId,
              changes: {
                old: purchase,
                new: updated,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
