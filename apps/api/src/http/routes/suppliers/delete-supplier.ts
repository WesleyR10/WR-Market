import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  SupplierDeleteNotAllowedError,
  SupplierNotFoundError,
} from '@/errors/domain/supplier-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteSupplier(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/suppliers/:supplierId',
      {
        schema: {
          tags: ['Suppliers'],
          summary: 'Delete a supplier',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            supplierId: z.string().uuid(),
          }),
          response: {
            204: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, supplierId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
        })

        if (!supplier) {
          throw new SupplierNotFoundError()
        }

        const ability = await getUserPermissions(userId, membership.role)

        if (!ability.can('delete', 'Supplier')) {
          throw new SupplierDeleteNotAllowedError()
        }

        await prisma.supplier.delete({
          where: { id: supplierId },
        })

        await prisma.auditLog.create({
          data: {
            memberId: membership.id,
            action: 'DELETE',
            entity: 'Supplier',
            entityId: supplierId,
            changes: {
              old: supplier,
              new: null,
              deletedAt: dateUtils.toISO(new Date()),
            },
            createdAt: dateUtils.toISO(new Date()),
          },
        })

        return reply.status(204).send({
          message: 'Fornecedor deletado com sucesso',
        })
      },
    )
}
