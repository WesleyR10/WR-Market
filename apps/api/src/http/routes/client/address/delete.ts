import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { clientAuth } from '@/http/middlewares/client-auth'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'

export async function deleteClientAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .delete(
      '/clients/addresses/:addressId',
      {
        schema: {
          tags: ['Client Addresses'],
          summary: 'Delete client address',
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

        if (!address || address.clientId !== clientId) {
          throw new BadRequestError('Address not found.')
        }

        if (address.isMain) {
          const hasOtherAddresses = await prisma.address.findFirst({
            where: { 
              clientId,
              id: { not: addressId }
            },
          })

          if (hasOtherAddresses) {
            await prisma.address.update({
              where: { id: hasOtherAddresses.id },
              data: { isMain: true }
            })
          }
        }

        await prisma.address.delete({
          where: { id: addressId },
        })

        return reply.send()
      }
    )
} 