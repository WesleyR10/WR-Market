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
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        await prisma.supplier.findMany({
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
        })

        return reply.status(201).send()
      },
    )
}
