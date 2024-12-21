import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function listSuppliers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/suppliers',
      {
        schema: {
          tags: ['Suppliers'],
          summary: 'List all suppliers',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            perPage: z.coerce.number().min(1).max(100).default(10),
          }),
          response: {
            200: z.object({
              suppliers: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  email: z.string().nullable(),
                  phone: z.string().nullable(),
                  cnpj: z.string(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              ),
              pagination: z.object({
                total: z.number(),
                page: z.number(),
                perPage: z.number(),
                totalPages: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)
        const { page, perPage } = request.query

        const [suppliers, total] = await Promise.all([
          prisma.supplier.findMany({
            where: {
              organizationId: membership.organizationId,
            },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              cnpj: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              name: 'asc',
            },
            take: perPage,
            skip: (page - 1) * perPage, // Cálculo correto de skip
          }),
          prisma.supplier.count({
            where: {
              organizationId: membership.organizationId,
            },
          }),
        ])

        return reply.status(200).send({
          suppliers: suppliers.map((supplier) => ({
            ...supplier,
            createdAt: supplier.createdAt.toISOString(),
            updatedAt: supplier.updatedAt.toISOString(),
          })),
          pagination: {
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
          },
        })
      },
    )
}
