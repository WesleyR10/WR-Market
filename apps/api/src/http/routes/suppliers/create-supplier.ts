import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { SupplierCreateNotAllowedError } from '@/errors/domain/supplier-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSupplier(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/suppliers',
      {
        schema: {
          tags: ['Suppliers'],
          summary: 'Create a new supplier',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            cnpj: z.string().length(14),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { name, email, phone, cnpj } = request.body
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const ability = await getUserPermissions(userId, membership.role)

        if (!ability.can('create', 'Supplier')) {
          throw new SupplierCreateNotAllowedError()
        }

        const supplier = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const created = await tx.supplier.create({
              data: {
                name,
                email,
                phone,
                cnpj,
                organizationId: membership.organizationId,
                createdById: userId,
              },
            })

            await prisma.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Supplier',
                entityId: created.id,
                changes: {
                  old: null,
                  new: created,
                },
                createdAt: dateUtils.toISO(new Date()),
              },
            })

            return created
          },
        )

        return reply.status(201).send({ supplierId: supplier.id })
      },
    )
}
