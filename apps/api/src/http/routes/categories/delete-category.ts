import { Prisma } from '@prisma/client'
import { categorySchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  CategoryDeleteNotAllowedError,
  CategoryNotFoundError,
} from '@/errors/domain/category-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

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
          select: {
            id: true,
            name: true,
            description: true,
            memberId: true,
            organizationId: true,
          },
        })

        if (!category) {
          throw new CategoryNotFoundError()
        }

        const authCategory = categorySchema.parse({
          __typename: 'Category',
          id: category.id,
          organizationId: category.organizationId,
          memberId: category.memberId,
        })
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authCategory)) {
          throw new CategoryDeleteNotAllowedError()
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          await tx.category.delete({
            where: {
              id: categoryId,
              organizationId: membership.organizationId,
            },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
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
