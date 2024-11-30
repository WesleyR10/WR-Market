import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from '@wr-market/env'
import { z } from 'zod'
import { hash, compare } from 'bcryptjs'

import { clientAuth } from '@/http/middlewares/client-auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function updateClientProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(clientAuth)
    .put(
      '/clients/me',
      {
        schema: {
          tags: ['Client'],
          summary: 'Update authenticated client profile',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string()
              .regex(/^[1-9]{2}9[0-9]{8}$/, 'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)')
              .optional(),
            currentPassword: z.string().optional(),
            newPassword: z.string().min(6).optional(),
            birthDate: z.string().datetime().optional(),
            avatarUrl: z.string().url().optional(),
          }).refine(data => {
            if (data.newPassword && !data.currentPassword) {
              return false
            }
            return true
          }, {
            message: 'Current password is required to change password'
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const clientId = await request.getClientId()
        const { 
          name,
          email,
          phone,
          currentPassword,
          newPassword,
          birthDate,
          avatarUrl,
        } = request.body

        const client = await prisma.client.findUnique({
          where: { id: clientId },
        })

        if (!client) {
          throw new BadRequestError('Client not found.')
        }

        if (email && email !== client.email) {
          const clientWithSameEmail = await prisma.client.findUnique({
            where: { email },
          })

          if (clientWithSameEmail) {
            throw new BadRequestError('Email already in use.')
          }
        }

        let passwordHash = undefined
        if (newPassword) {
          const isPasswordValid = await compare(
            currentPassword!,
            client.passwordHash!,
          )

          if (!isPasswordValid) {
            throw new BadRequestError('Invalid current password.')
          }

          passwordHash = await hash(newPassword, env.HASH_ROUNDS)
        }

        await prisma.client.update({
          where: { id: clientId },
          data: {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(passwordHash !== undefined && { passwordHash }),
            ...(birthDate !== undefined && { birthDate: new Date(birthDate) }),
            ...(avatarUrl !== undefined && { avatarUrl }),
          },
        })

        return reply.send()
      },
    )
} 