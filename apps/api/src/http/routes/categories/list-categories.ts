import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { OrganizationNotFoundError } from '@/errors/domain/organization-errors'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function listCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug/categories',
    {
      schema: {
        tags: ['Categories'],
        summary: 'List all categories',
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
                isActive: z.boolean(),
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

      // Buscar a organização pelo slug
      const organization = await prisma.organization.findUnique({
        where: { slug },
      })

      if (!organization) {
        throw new OrganizationNotFoundError()
      }

      // Buscar as categorias da organização
      const categories = await prisma.category.findMany({
        where: {
          organizationId: organization.id,
          isActive: true, // Opcional: retornar apenas categorias ativas
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return reply.send({
        categories: categories.map((category) => ({
          ...category,
          createdAt: dateUtils.formatDisplay(category.createdAt),
          updatedAt: dateUtils.formatDisplay(category.updatedAt),
        })),
      })
    },
  )
}
