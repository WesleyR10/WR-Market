import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { ProductNotFoundError } from '@/errors/domain/product-errors'

export async function getProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/products/:id',
      {
        schema: {
          tags: ['Products'],
          summary: 'Get a product by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { id } = request.params

        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            category: true,
            stock: true,
            createdBy: {
              include: {
                user: true
              }
            }
          },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        return reply.send({ product })
      },
    )
} 