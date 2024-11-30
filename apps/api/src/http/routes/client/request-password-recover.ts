import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'

export async function requestClientPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/clients/password/recover',
    {
      schema: {
        tags: ['Client'],
        summary: 'Request client password recovery via email or phone',
        body: z.object({
          email: z.string().email().optional(),
          phone: z.string()
            .regex(/^[1-9]{2}9[0-9]{8}$/, 'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)')
            .optional(),
        }).refine(data => data.email || data.phone, {
          message: 'É necessário fornecer email ou telefone'
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, phone } = request.body

      const client = await prisma.client.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          isActive: true,
        },
      })

      if (!client) {
        // Don't reveal if client exists
        return reply.status(201).send()
      }

      const { id: code } = await prisma.clientToken.create({
        data: {
          type: 'PASSWORD_RECOVER',
          clientId: client.id,
        },
      })

      if (email) {
        console.log('Client password recover token (email):', code)
        // TODO: Send email with recovery code
      } else if (phone) {
        console.log('Client password recover token (SMS):', code)
        // TODO: Send SMS with recovery code
      }

      return reply.status(201).send()
    },
  )
} 