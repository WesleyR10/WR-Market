import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'
import { AddressNotFoundError, AddressUnauthorizedError } from '@/errors/domain/address-errors'

export async function updateClientAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .put(
      '/clients/addresses/:addressId',
      {
        schema: {
          tags: ['Client Addresses'],
          summary: 'Update client address',
          security: [{ bearerAuth: [] }],
          params: z.object({
            addressId: z.string().uuid(),
          }),
          body: z.object({
            street: z.string().optional(),
            number: z.string().optional(),
            district: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            isMain: z.boolean().optional(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()
        const { addressId } = request.params
        const addressData = request.body

        const address = await prisma.address.findUnique({
          where: { id: addressId },
        })

        if (!address) {
          throw new AddressNotFoundError()
        }

        if (address.clientId !== clientId) {
          throw new AddressUnauthorizedError()
        }

        if (addressData.isMain) {
          await prisma.address.updateMany({
            where: { 
              clientId,
              isMain: true,
              id: { not: addressId }
            },
            data: { isMain: false }
          })
        }

        await prisma.address.update({
          where: { id: addressId },
          data: addressData,
        })

        return reply.send()
      }
    )
} 