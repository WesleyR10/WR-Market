import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'
import { ClientNotFoundError } from '@/errors/domain/client-errors'

export async function getClientProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .get(
      '/clients/me',
      {
        schema: {
          tags: ['Client'],
          summary: 'Get authenticated client profile',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              client: z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().email().nullable(),
                phone: z.string().nullable(),
                cpf: z.string().nullable(),
                avatarUrl: z.string().url().nullable(),
                birthDate: z.string().datetime().nullable(),
                addresses: z.array(z.object({
                  id: z.string().uuid(),
                  street: z.string(),
                  number: z.string(),
                  district: z.string(),
                  city: z.string(),
                  state: z.string(),
                  zipCode: z.string(),
                })),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()

        const client = await prisma.client.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cpf: true,
            avatarUrl: true,
            birthDate: true,
            addresses: {
              select: {
                id: true,
                street: true,
                number: true,
                district: true,
                city: true,
                state: true,
                zipCode: true,
                isMain: true,
              },
            },
          },
          where: {
            id: clientId,
          },
        })

        if (!client) {
          throw new ClientNotFoundError()
        }

        return reply.send({ 
          client: {
            ...client,
            birthDate: client.birthDate?.toISOString() || null,
          }
        })
      },
    )
} 