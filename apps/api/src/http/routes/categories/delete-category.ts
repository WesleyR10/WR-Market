import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { CategoryNotFoundError, CategoryDeleteNotAllowedError } from '@/errors/domain/category-errors'
import { categorySchema } from '@wr-market/auth'

export async function deleteCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Delete a category',
          security: [{ bearerAuth: [] }],
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

        if (cannot('delete', authCategory)) {
          throw new CategoryDeleteNotAllowedError()
        }

        await prisma.$transaction(async (tx) => {
          await tx.category.delete({
            where: { 
              id: categoryId,
              organizationId: membership.organizationId 
            },
          })

          await tx.auditLog.create({
            data: {
              userId,
              action: 'DELETE',
              entity: 'Category',
              entityId: categoryId,
              changes: {
                deleted: {
                  name: category.name,
                  description: category.description,
                  organizationId: category.organizationId,
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