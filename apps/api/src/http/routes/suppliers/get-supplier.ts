import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  SupplierGetNotAllowedError,
  SupplierNotFoundError,
} from '@/errors/domain/supplier-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getSupplier(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/suppliers/:supplierId',
      {
        schema: {
          tags: ['Suppliers'],
          summary: 'Get supplier details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            supplierId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              supplier: z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().nullable(),
                phone: z.string().nullable(),
                cnpj: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, supplierId } = request.params
        const { membership } = await request.getUserMembership(slug)
        const userId = await request.getCurrentUserId()

        const ability = await getUserPermissions(userId, membership.role)

        if (!ability.can('get', 'Supplier')) {
          throw new SupplierGetNotAllowedError()
        }

        const supplier = await prisma.supplier.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cnpj: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            id: supplierId,
            organizationId: membership.organizationId,
          },
        })

        if (!supplier) {
          throw new SupplierNotFoundError()
        }

        return reply.status(200).send()
      },
    )
}
