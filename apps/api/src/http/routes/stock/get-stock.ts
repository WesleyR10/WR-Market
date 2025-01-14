import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  StockGetNotAllowedError,
  StockNotFoundError,
} from '@/errors/domain/stock-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getStock(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/stocks/:stockId',
      {
        schema: {
          tags: ['Stock'],
          summary: 'Get stock details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            stockId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              stock: z.object({
                id: z.string().uuid(),
                quantity: z.number().int(),
                createdAt: z.string(),
                updatedAt: z.string(),
                product: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  description: z.string().nullable(),
                  price: z.number(),
                  images: z.array(z.string()).nullable(),
                  isActive: z.boolean(),
                  categoryId: z.string().uuid(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, stockId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Stock')) {
          throw new StockGetNotAllowedError()
        }

        const stock = await prisma.stock.findUnique({
          where: {
            id: stockId,
            organizationId: membership.organizationId, // Garante que o stock pertence à organização
          },
          include: {
            Product: true, // Inclui os dados do produto relacionado
          },
        })

        if (!stock || stock.organizationId !== membership.organizationId) {
          throw new StockNotFoundError()
        }

        return reply.send({
          stock: {
            id: stock.id,
            quantity: stock.quantity,
            createdAt: dateUtils.toISO(stock.createdAt),
            updatedAt: dateUtils.toISO(stock.updatedAt),
            product: {
              id: stock.Product.id,
              name: stock.Product.name,
              description: stock.Product.description,
              price: Number(stock.Product.price),
              images: stock.Product.images,
              isActive: stock.Product.isActive,
              categoryId: stock.Product.categoryId,
            },
          },
        })
      },
    )
}
