import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function listCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/categories',
      {
        schema: {
          tags: ['Categories'],
          summary: 'List all categories',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              categories: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  description: z.string().nullable(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        const categories = await prisma.category.findMany({
          where: {
            organizationId: membership.organizationId,
          },
          orderBy: {
            name: 'asc',
          },
        })

        return reply.send({
          categories: categories.map(category => ({
            ...category,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
          })),
        })
      },
    )
} 