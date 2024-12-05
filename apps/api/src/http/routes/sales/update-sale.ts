import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { SaleNotFoundError, SaleUpdateNotAllowedError } from '@/errors/domain/sale-errors'

export async function updateSale(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/sales/:saleId',
      {
        schema: {
          tags: ['Sales'],
          summary: 'Atualizar detalhes de uma venda',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            saleId: z.string().uuid(),
          }),
          body: z.object({
            status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
            items: z.array(z.object({
              productId: z.string().uuid(),
              quantity: z.number().int().positive(),
              price: z.number().positive(),
            })).optional(),
          }).refine(data => data.status || data.items, {
            message: 'É necessário fornecer status ou itens para atualização'
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, saleId } = request.params
        const { status, items } = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Sale')) {
          throw new SaleUpdateNotAllowedError()
        }

        const sale = await prisma.sale.findUnique({
          where: { id: saleId },
        })

        if (!sale) {
          throw new SaleNotFoundError()
        }

        await prisma.$transaction(async (tx) => {
          if (status) {
            await tx.sale.update({
              where: { id: saleId },
              data: { status },
            })
          }

          if (items) {
            // Atualize os itens conforme a lógica de negócio
            // Exemplo simplificado: deletar todos os itens e recriar
            await tx.saleItem.deleteMany({ where: { saleId } })
            for (const item of items) {
              await tx.saleItem.create({
                data: {
                  saleId,
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                },
              })
            }
          }

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Sale',
              entityId: saleId,
              changes: {
                status,
                items,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply.status(204).send()
      },
    )
} 