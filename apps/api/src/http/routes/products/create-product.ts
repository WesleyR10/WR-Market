import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { CategoryNotBelongsToOrganizationError } from '@/errors/domain/category-errors'
import { ProductCreateNotAllowedError } from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['Products'],
          summary: 'Create a new product',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
            price: z.number().positive(),
            categoryId: z.string().uuid(),
            imageUrl: z.string().url().optional(),
            isActive: z.boolean().default(true),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { categoryId } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const category = await prisma.category.findFirst({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        if (!category) {
          throw new CategoryNotBelongsToOrganizationError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Product')) {
          throw new ProductCreateNotAllowedError()
        }

        const product = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const created = await tx.product.create({
              data: {
                ...request.body,
                createdById: membership.id,
                organizationId: organization.id,
              },
            })

            await tx.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Product',
                entityId: created.id,
                changes: {
                  old: null,
                  new: created,
                },
                createdAt: new Date(),
              },
            })

            return created
          },
        )

        return reply.status(201).send({ id: product.id })
      },
    )
}
