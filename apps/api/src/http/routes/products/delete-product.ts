import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  ProductDeleteNotAllowedError,
  ProductHasRelationsError,
  ProductNotFoundError,
} from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/products/:id',
      {
        schema: {
          tags: ['Products'],
          summary: 'Delete a product',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Product')) {
          throw new ProductDeleteNotAllowedError()
        }

        const product = await prisma.product.findFirst({
          where: {
            id,
            organizationId: membership.organizationId,
          },
          include: {
            _count: {
              select: {
                // salesItems: true, // Incluir depois
                purchaseItems: true,
              },
            },
          },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        if (
          /* product._count.salesItems > 0 || */ // Incluir depois
          product._count.purchaseItems > 0
        ) {
          throw new ProductHasRelationsError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          await tx.product.delete({
            where: { id },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'DELETE',
              entity: 'Product',
              entityId: id,
              changes: {
                old: product,
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
