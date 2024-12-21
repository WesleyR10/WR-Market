import { Prisma } from '@prisma/client'
import { productSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  ProductNotFoundError,
  ProductUpdateNotAllowedError,
} from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/products/:id',
      {
        schema: {
          tags: ['Products'],
          summary: 'Update product details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().positive().optional(),
            categoryId: z.string().uuid().optional(),
            imageUrl: z.string().url().optional(),
            isActive: z.boolean().optional(),
          }),
          response: {
            204: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const product = await prisma.product.findUnique({
          where: {
            id,
            organizationId: membership.organizationId,
          },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        const authProduct = productSchema.parse(product)

        if (cannot('update', authProduct)) {
          throw new ProductUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const updated = await tx.product.update({
            where: { id },
            data: request.body,
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Product',
              entityId: id,
              changes: {
                old: product,
                new: updated,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply
          .status(204)
          .send({ message: 'Produto atualizado com sucesso' })
      },
    )
}
