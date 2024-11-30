import { hash } from 'bcryptjs'
import { env } from '@wr-market/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { EmailInUseError, PhoneInUseError } from '@/errors/domain/auth-errors'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email().optional(),
          phone: z.string()
            .regex(/^[1-9]{2}9[0-9]{8}$/, 'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)')
            .optional(),
          password: z.string().min(6),
        }).refine(data => data.email || data.phone, {
          message: 'É necessário fornecer email ou telefone'
        }),
      },
    },
    async (request, reply) => {
      const { name, email, phone, password } = request.body

      // Check for existing email if provided
      if (email) {
        const userWithSameEmail = await prisma.user.findUnique({
          where: { email },
        })

        if (userWithSameEmail) {
          throw new EmailInUseError()
        }
      }

      // Check for existing phone if provided
      if (phone) {
        const userWithSamePhone = await prisma.user.findUnique({
          where: { phone },
        })

        if (userWithSamePhone) {
          throw new PhoneInUseError()
        }
      }

      // Handle auto-join organization only if email is provided
      let autoJoinOrganization = undefined
      if (email) {
        const [, domain] = email.split('@')
        autoJoinOrganization = await prisma.organization.findFirst({
          where: {
            domain,
            shouldAttachUsersByDomain: true,
          },
        })
      }

      const passwordHash = await hash(password, env.HASH_ROUNDS)

      await prisma.user.create({
        data: {
          name,
          email: email || undefined,
          phone: phone || undefined,
          passwordHash,
          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
