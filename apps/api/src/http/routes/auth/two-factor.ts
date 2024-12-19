import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { InvalidTokenError } from '@/errors/domain/auth-errors'
import { prisma } from '@/lib/prisma'

export async function twoFactorRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/two-factor/verify',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Verify 2FA code',
        body: z.object({
          code: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const token = await prisma.token.findFirst({
        where: {
          id: code,
          type: 'TWO_FACTOR',
          createdAt: {
            // Token válido por 5 minutos
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
        include: {
          user: true,
        },
      })

      if (!token) {
        throw new InvalidTokenError()
      }

      // Remove o token usado
      await prisma.token.delete({
        where: { id: token.id },
      })

      // Cria/atualiza a confirmação usando o userId do token
      await prisma.twoFactorConfirmation.upsert({
        where: { userId: token.userId },
        create: { userId: token.userId },
        update: { createdAt: new Date() },
      })

      // Gera o token JWT usando o userId do token
      const authToken = await reply.jwtSign(
        { sub: token.userId },
        { sign: { expiresIn: '7d' } },
      )

      return reply.status(200).send({ token: authToken })
    },
  )
}
