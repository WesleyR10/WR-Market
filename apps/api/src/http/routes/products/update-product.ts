import { productSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { 
  ProductNotFoundError,
  ProductUpdateNotAllowedError 
} from '@/errors/domain/product-errors'

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
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } = await request.getUserMembership(slug)

        const product = await prisma.product.findUnique({
          where: { id },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        const authProduct = productSchema.parse(product)

        if (cannot('update', authProduct)) {
          throw new ProductUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx) => {
          const updated = await tx.product.update({
            where: { id },
            data: request.body,
          })

          await tx.auditLog.create({
            data: {
              userId,
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

        return reply.status(204).send()
      },
    )
} 