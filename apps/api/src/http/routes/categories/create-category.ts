import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { CategoryCreateNotAllowedError } from '@/errors/domain/category-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/categories',
      {
        schema: {
          tags: ['Categories'],
          summary: 'Create a new category',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              categoryId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { name, description } = request.body

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Category')) {
          throw new CategoryCreateNotAllowedError()
        }

        const category = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const created = await tx.category.create({
              data: {
                name,
                description,
                organizationId: organization.id,
                createdById: membership.id,
              },
            })

            await tx.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Category',
                entityId: created.id,
                changes: {
                  name,
                  description,
                  organizationId: organization.id,
                },
                createdAt: dateUtils.toDate(new Date()),
              },
            })

            return created
          },
        )

        return reply.status(201).send({
          categoryId: category.id,
        })
      },
    )
}
