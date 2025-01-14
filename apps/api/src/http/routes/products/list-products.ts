import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function listProducts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug/products',
    {
      schema: {
        tags: ['Products'],
        summary: 'List all products',
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(100).default(20),
          search: z.string().optional(),
          categoryId: z.string().uuid().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { membership } = await request.getUserMembership(slug)
      const { page, perPage, search, categoryId } = request.query

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            organizationId: membership.organizationId,
            ...(search && {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }),
            ...(categoryId && { categoryId }),
          },
          include: {
            category: true,
            stock: true,
          },
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({
          where: {
            organizationId: membership.organizationId,
            ...(search && {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }),
            ...(categoryId && { categoryId }),
          },
        }),
      ])

      return reply.send({
        products: products.map((product) => ({
          ...product,
          createdAt: dateUtils.toISO(product.createdAt),
          updatedAt: dateUtils.toISO(product.updatedAt),
          price: Number(product.price),
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
