import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { SaleCreateNotAllowedError } from '@/errors/domain/sale-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSale(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/sales',
      {
        schema: {
          tags: ['Sales'],
          summary: 'Criar uma nova venda',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            clientId: z.string().uuid(),
            items: z.array(
              z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().positive(),
                price: z.number().positive(),
              }),
            ),
            sellerId: z.string().uuid().optional(), // ID do vendedor (opcional)
          }),
          response: {
            201: z.object({
              saleId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { clientId, items, sellerId } = request.body

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        if (sellerId) {
          const { cannot } = getUserPermissions(userId, membership.role)
          if (cannot('create', 'Sale')) {
            throw new SaleCreateNotAllowedError()
          }
        }

        const sale = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const createdSale = await tx.sale.create({
              data: {
                clientId,
                total: items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
                createdById: sellerId || null,
                source: sellerId ? 'ADMIN' : 'ECOMMERCE',
                organizationId: membership.organizationId,
                createdAt: dateUtils.toDate(new Date()),
              },
            })

            for (const item of items) {
              await tx.saleItem.create({
                data: {
                  saleId: createdSale.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                },
              })
            }

            await tx.auditLog.create({
              data: {
                memberId: membership.id,
                action: 'CREATE',
                entity: 'Sale',
                entityId: createdSale.id,
                changes: {
                  clientId,
                  items,
                  total: createdSale.total,
                },
                createdAt: dateUtils.toDate(new Date()),
              },
            })

            return createdSale
          },
        )

        return reply.status(201).send({
          saleId: sale.id,
        })
      },
    )
}
