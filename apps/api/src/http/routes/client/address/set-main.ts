import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'
import { AddressNotFoundError, AddressUnauthorizedError } from '@/errors/domain/address-errors'

export async function setMainClientAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .patch(
      '/clients/addresses/:addressId/main',
      {
        schema: {
          tags: ['Client Addresses'],
          summary: 'Set address as main',
          security: [{ bearerAuth: [] }],
          params: z.object({
            addressId: z.string().uuid(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()
        const { addressId } = request.params

        const address = await prisma.address.findUnique({
          where: { id: addressId },
        })

        if (!address) {
          throw new AddressNotFoundError()
        }

        if (address.clientId !== clientId) {
          throw new AddressUnauthorizedError()
        }

        await prisma.$transaction([
          prisma.address.updateMany({
            where: { 
              clientId,
              isMain: true 
            },
            data: { isMain: false }
          }),
          prisma.address.update({
            where: { id: addressId },
            data: { isMain: true }
          })
        ])

        return reply.send()
      }
    )
} 