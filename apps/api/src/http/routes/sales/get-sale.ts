import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { SaleGetNotAllowedError, SaleNotFoundError } from '@/errors/domain/sale-errors'

export async function getSale(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/sales/:saleId',
      {
        schema: {
          tags: ['Sales'],
          summary: 'Obter detalhes de uma venda específica',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            saleId: z.string().uuid(), // UUID da venda
          }),
          response: {
            200: z.object({
              sale: z.object({
                id: z.string().uuid(),
                clientId: z.string().uuid(),
                total: z.number(),
                status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
                source: z.enum(['ADMIN', 'ECOMMERCE']),
                createdAt: z.string(),
                updatedAt: z.string(),
                createdBy: z.string().uuid().optional(),
                items: z.array(z.object({
                  id: z.string().uuid(),
                  productId: z.string().uuid(),
                  quantity: z.number().int().positive(),
                  price: z.number().positive(),
                })),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { saleId } = request.params
        const userId = await request.getCurrentUserId()

        const sale = await prisma.sale.findUnique({
          where: { id: saleId },
          include: {
            items: true,
          },
        })

        if (!sale) {
          throw new SaleNotFoundError()
        }

        // Validação para clientes
        if (sale.source === 'ECOMMERCE' && sale.clientId !== userId) {
          throw new SaleGetNotAllowedError() // Lançar erro se o cliente tentar acessar uma venda que não é sua
        }

        return reply.status(200).send({
          sale: {
            id: sale.id,
            clientId: sale.clientId,
            total: Number(sale.total),
            status: sale.status,
            source: sale.source,
            createdAt: sale.createdAt.toISOString(),
            updatedAt: sale.updatedAt.toISOString(),
            createdBy: sale.createdById ?? undefined,
            items: sale.items.map(item => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          },
        })
      },
    )
} 