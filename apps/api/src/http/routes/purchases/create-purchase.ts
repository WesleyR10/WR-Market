import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  PurchaseCreateNotAllowedError,
  PurchaseNotFoundError,
} from '@/errors/domain/purchase-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createPurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Create a new purchase',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            supplierId: z.string().uuid(),
            items: z.array(
              z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().positive(),
                price: z.number().positive(),
              }),
            ),
          }),
          response: {
            201: z.object({
              purchaseId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { supplierId, items } = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Purchase')) {
          throw new PurchaseCreateNotAllowedError()
        }

        // Verificar se o fornecedor pertence à organização
        const supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
        })

        if (
          !supplier ||
          supplier.organizationId !== membership.organizationId
        ) {
          throw new PurchaseNotFoundError()
        }

        // Calcular o total
        const total = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0,
        )

        const purchase = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const created = await tx.purchase.create({
              data: {
                total,
                supplierId,
                createdById: membership.id,
                organizationId: membership.organizationId,
              },
            })

            // Criar PurchaseItems
            for (const item of items) {
              await tx.purchaseItem.create({
                data: {
                  purchaseId: created.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                },
              })
            }

            await tx.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Purchase',
                entityId: created.id,
                changes: {
                  supplierId,
                  total,
                  items,
                },
                createdAt: new Date(),
              },
            })

            return created
          },
        )

        return reply.status(201).send({
          purchaseId: purchase.id,
        })
      },
    )
}
