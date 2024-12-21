import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NoPasswordError } from '@/errors/domain/auth-errors'
import { InvalidCredentialsError } from '@/errors/domain/shared-errors'
import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with email/phone & password',
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
            password: z.string(),
            code: z.string().optional(),
          })
          .refine((data) => data.email || data.phone, {
            message: 'É necessário fornecer email ou telefone',
          }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          201: z.object({
            token: z.string(),
            organization: z
              .object({
                slug: z.string(),
              })
              .optional(),
          }),
          202: z.object({
            requiresTwoFactor: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, phone, password, code } = request.body

      const userFromCredentials = await prisma.user.findFirst({
        where: {
          OR: [{ email: email || undefined }, { phone: phone || undefined }],
        },
        include: {
          member_on: {
            include: {
              organization: {
                select: {
                  slug: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      })

      if (!userFromCredentials) {
        throw new InvalidCredentialsError()
      }

      if (userFromCredentials.passwordHash === null) {
        throw new NoPasswordError()
      }

      const isPasswordValid = await compare(
        password,
        userFromCredentials.passwordHash,
      )

      if (!isPasswordValid) {
        throw new InvalidCredentialsError()
      }

      // Two factor
      if (userFromCredentials.isTwoFactorEnabled) {
        if (!code) {
          // Gera código de 6 dígitos
          const twoFactorCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString()

          // Salva o token
          await prisma.token.create({
            data: {
              id: twoFactorCode,
              type: 'TWO_FACTOR',
              userId: userFromCredentials.id,
            },
          })

          // TODO: Enviar código por email
          console.log('Two factor code:', twoFactorCode)

          return reply.status(202).send({
            requiresTwoFactor: true,
            message: 'Código de verificação enviado para seu email.',
          })
        }
      }

      // Gera JWT e retorna
      const token = await reply.jwtSign(
        {
          sub: userFromCredentials.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      const organization = userFromCredentials.member_on[0]?.organization

      return reply.status(201).send({
        token,
        organization: organization ? { slug: organization.slug } : undefined,
      })
    },
  )
}
