import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ProductNotFoundError } from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

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
          response: {
            200: z.object({
              product: z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string().nullable(),
                price: z.number(),
                isActive: z.boolean(),
                imageUrl: z.string().nullable(),
                organizationId: z.string(),
                categoryId: z.string(),
                createdById: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
                category: z.object({
                  id: z.string(),
                  name: z.string(),
                }),
                stock: z.array(
                  z.object({
                    id: z.string(),
                    quantity: z.number(),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params

        const product = await prisma.product.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            isActive: true,
            imageUrl: true,
            organizationId: true,
            categoryId: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            stock: {
              select: {
                id: true,
                quantity: true,
              },
            },
          },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        return reply.send({
          product: {
            ...product,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            price: Number(product.price),
          },
        })
      },
    )
}
