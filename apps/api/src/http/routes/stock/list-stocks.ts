import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { StockGetNotAllowedError } from '@/errors/domain/stock-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

interface Stock {
  id: string
  quantity: number
  productId: string
  createdAt: Date
  updatedAt: Date
}

export async function listStocks(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/stocks',
      {
        schema: {
          tags: ['Stock'],
          summary: 'List all stock entries',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            perPage: z.coerce.number().min(1).max(100).default(20),
            search: z.string().optional(),
            productId: z.string().uuid().optional(),
          }),
          response: {
            200: z.object({
              stocks: z.array(
                z.object({
                  id: z.string().uuid(),
                  quantity: z.number().int(),
                  productId: z.string().uuid(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              ),
              pagination: z.object({
                page: z.number(),
                perPage: z.number(),
                total: z.number(),
                totalPages: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)
        const { page, perPage, search, productId } = request.query

        const { cannot } = getUserPermissions(
          await request.getCurrentUserId(),
          membership.role,
        )

        if (cannot('get', 'Stock')) {
          throw new StockGetNotAllowedError()
        }

        const [stocks, total] = await Promise.all([
          prisma.stock.findMany({
            where: {
              organizationId: membership.organizationId,
              ...(search && {
                OR: [
                  { id: { contains: search, mode: 'insensitive' } },
                  { quantity: { equals: Number(search) } },
                ],
              }),
              ...(productId && { productId }),
            },
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.stock.count({
            where: {
              organizationId: membership.organizationId,
              ...(search && {
                OR: [
                  { id: { contains: search, mode: 'insensitive' } },
                  { quantity: { equals: Number(search) } },
                ],
              }),
              ...(productId && { productId }),
            },
          }),
        ])

        return reply.send({
          stocks: stocks.map((stock: Stock) => ({
            ...stock,
            createdAt: stock.createdAt.toISOString(),
            updatedAt: stock.updatedAt.toISOString(),
          })),
          pagination: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
          },
        })
      },
    )
}
