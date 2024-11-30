import { FastifyInstance } from 'fastify'
import { env } from '@wr-market/env'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { InvalidRecoveryTokenError } from '@/errors/domain/client-errors'

export async function resetClientPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/clients/password/reset',
    {
      schema: {
        tags: ['Client'],
        summary: 'Reset client password using recovery token',
        body: z.object({
          token: z.string().uuid(),
          password: z.string().min(6),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { token, password } = request.body

      const recoveryToken = await prisma.clientToken.findFirst({
        where: {
          id: token,
          type: 'PASSWORD_RECOVER',
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes
          },
        },
        include: {
          client: true,
        },
      })

      if (!recoveryToken) {
        throw new InvalidRecoveryTokenError()
      }

      const passwordHash = await hash(password, env.HASH_ROUNDS)

      await prisma.$transaction([
        prisma.client.update({
          where: { id: recoveryToken.clientId },
          data: { passwordHash },
        }),
        prisma.clientToken.delete({
          where: { id: token },
        }),
      ])

      return reply.status(201).send()
    },
  )
} 