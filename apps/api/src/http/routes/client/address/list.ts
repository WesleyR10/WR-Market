import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'

export async function listClientAddresses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .get(
      '/clients/addresses',
      {
        schema: {
          tags: ['Client Addresses'],
          summary: 'List all client addresses',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              addresses: z.array(z.object({
                id: z.string().uuid(),
                street: z.string(),
                number: z.string(),
                district: z.string(),
                city: z.string(),
                state: z.string(),
                zipCode: z.string(),
                isMain: z.boolean(),
              })),
            }),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()

        const addresses = await prisma.address.findMany({
          where: { clientId },
          orderBy: [
            { isMain: 'desc' },
          ]
        })

        return reply.send({ addresses })
      }
    )
} 