import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Request password recovery via email or phone',
        body: z
          .object({
            email: z.string().email().optional(),
            phone: z
              .string()
              .regex(
                /^[1-9]{2}9[0-9]{8}$/,
                'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)',
              )
              .optional(),
          })
          .refine((data) => data.email || data.phone, {
            message: 'É necessário fornecer email ou telefone',
          }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, phone } = request.body

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: email || undefined }, { phone: phone || undefined }],
        },
      })

      if (!user) {
        // We don't want to people to know if the user really exists
        return reply.status(201).send()
      }

      const code = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: user.id,
        },
      })

      // TODO: Send recovery code based on method used
      if (email) {
        console.log('Password recover token (email):', code.id)
        // Send email with recovery code
      } else if (phone) {
        console.log('Password recover token (SMS):', code.id)
        // Send SMS with recovery code
      }

      return reply.status(201).send()
    },
  )
}
