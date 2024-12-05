import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { SupplierNotFoundError, SupplierUpdateNotAllowedError } from '@/errors/domain/supplier-errors'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateSupplier(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/suppliers/:supplierId',
      {
        schema: {
          tags: ['Suppliers'],
          summary: 'Update supplier details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            supplierId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            cnpj: z.string().length(14).optional(),
          }),
        },
      },
      async (request, reply) => {
        const { slug, supplierId } = request.params
        const { name, email, phone, cnpj } = request.body
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
        })

        if (!supplier) {
          throw new SupplierNotFoundError()
        }

        const ability = await getUserPermissions(userId, membership.role)

        if (!ability.can('update', 'Supplier')) {
          throw new SupplierUpdateNotAllowedError()
        }

        await prisma.$transaction(async (tx) => {
          const updated = await tx.supplier.update({
            where: { id: supplierId },
            data: {
              ...(name !== undefined && { name }),
              ...(email !== undefined && { email }),
              ...(phone !== undefined && { phone }),
              ...(cnpj !== undefined && { cnpj }),
            },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Supplier',
              entityId: supplierId,
              changes: {
                old: supplier,
                new: updated,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
} 