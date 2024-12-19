import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function updateProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/profile',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Update authenticated user profile',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z
              .string()
              .regex(
                /^[1-9]{2}9[0-9]{8}$/,
                'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)',
              )
              .optional(),
            avatarUrl: z.string().url().optional(),
            isTwoFactorEnabled: z.boolean().optional(),
          }),
          response: {
            200: z.object({
              message: z.string(),
              success: z.boolean(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name, email, phone, avatarUrl, isTwoFactorEnabled } =
          request.body

        await prisma.user.update({
          where: { id: userId },
          data: {
            name,
            email,
            phone,
            avatarUrl,
            isTwoFactorEnabled,
          },
        })

        return reply.status(200).send({
          message: 'Dados atualizados com sucesso',
          success: true,
        })
      },
    )
}
