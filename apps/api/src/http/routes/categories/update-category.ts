import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { CategoryNotFoundError, CategoryUpdateNotAllowedError } from '@/errors/domain/category-errors'
import { categorySchema } from '@wr-market/auth'

export async function updateCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Update category details',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
          }),
          params: z.object({
            slug: z.string(),
            categoryId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, categoryId } = request.params
        const updateData = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        })

        if (!category) {
          throw new CategoryNotFoundError()
        }

        const authCategory = categorySchema.parse(category)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authCategory)) {
          throw new CategoryUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx) => {
          const updated = await tx.category.update({
            where: { id: categoryId },
            data: updateData,
          })

          await tx.auditLog.create({
            data: {
              userId,
              action: 'UPDATE',
              entity: 'Category',
              entityId: categoryId,
              changes: {
                old: {
                  name: category.name,
                  description: category.description,
                },
                new: {
                  name: updated.name,
                  description: updated.description,
                },
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
} 