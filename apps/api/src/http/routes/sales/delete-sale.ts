import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  SaleDeleteNotAllowedError,
  SaleNotFoundError,
} from '@/errors/domain/sale-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteSale(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/sales/:saleId',
      {
        schema: {
          tags: ['Sales'],
          summary: 'Deletar uma venda',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            saleId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, saleId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Sale')) {
          throw new SaleDeleteNotAllowedError()
        }

        const sale = await prisma.sale.findUnique({
          where: { id: saleId },
        })

        if (!sale) {
          throw new SaleNotFoundError()
        }

        await prisma.$transaction([
          prisma.sale.delete({
            where: { id: saleId },
          }),
          prisma.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'DELETE',
              entity: 'Sale',
              entityId: saleId,
              changes: {
                deleted: {
                  clientId: sale.clientId,
                  total: sale.total,
                  status: sale.status,
                },
              },
              createdAt: dateUtils.toDate(new Date()),
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
