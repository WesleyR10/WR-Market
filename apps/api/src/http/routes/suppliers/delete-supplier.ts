import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { SupplierNotFoundError, SupplierDeleteNotAllowedError } from '@/errors/domain/supplier-errors'
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

        return reply.status(204).send()
      },
    )
} 