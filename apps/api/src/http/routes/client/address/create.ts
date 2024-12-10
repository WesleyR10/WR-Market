import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'

export async function createClientAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .post(
      '/clients/addresses',
      {
        schema: {
          tags: ['Client Addresses'],
          summary: 'Create a new address for authenticated client',
          security: [{ bearerAuth: [] }],
          body: z.object({
            street: z.string(),
            number: z.string(),
            district: z.string(),
            city: z.string(),
            state: z.string(),
            zipCode: z.string(),
            isMain: z.boolean().default(false),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()
        const addressData = request.body

        if (addressData.isMain) {
          // Se o novo endereço for principal, remove o principal anterior
          await prisma.address.updateMany({
            where: {
              clientId,
              isMain: true,
            },
            data: { isMain: false },
          })
        }

        const address = await prisma.address.create({
          data: {
            ...addressData,
            clientId,
          },
          select: { id: true },
        })

        return reply.status(201).send(address)
      },
    )
}
