import { env } from '@wr-market/env'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { InvalidTokenError } from '@/errors/domain/auth-errors'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get authenticated user profile',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        200: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
        400: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      // Buscar o token no banco de dados
      const tokenRecord = await prisma.token.findFirst({
        where: {
          id: code,
          type: 'PASSWORD_RECOVER',
          createdAt: {
            gte: dateUtils.addMinutes(new Date(), -30),
          },
        },
        include: {
          user: true,
        },
      })

      if (!tokenRecord) {
        throw new InvalidTokenError()
      }

      // Gerar o hash da nova senha
      const passwordHash = await hash(password, env.HASH_ROUNDS)

      // Atualizar a senha do usuário e remover o token em uma transação
      await prisma.$transaction([
        prisma.user.update({
          where: { id: tokenRecord.userId },
          data: { passwordHash },
        }),
        prisma.token.delete({
          where: { id: code },
        }),
      ])

      return reply.status(200).send({
        success: true,
        message: 'Senha redefinida com sucesso!',
      })
    },
  )
}
