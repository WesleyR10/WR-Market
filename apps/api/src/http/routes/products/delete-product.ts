import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { 
  ProductNotFoundError,
  ProductDeleteNotAllowedError 
} from '@/errors/domain/product-errors'

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

        const product = await prisma.product.findUnique({
          where: { id },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        await prisma.$transaction(async (tx) => {
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
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
} 