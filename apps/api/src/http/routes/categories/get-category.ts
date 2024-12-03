import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { CategoryNotFoundError } from '@/errors/domain/category-errors'

export async function getCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Get category details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            categoryId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              category: z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string().nullable(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, categoryId } = request.params

        await request.getUserMembership(slug)

        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        })

        if (!category) {
          throw new CategoryNotFoundError()
        }

        return reply.send({
          category: {
            ...category,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
          },
        })
      },
    )
} 