import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with email/phone & password',
        body: z.object({
          email: z.string().email().optional(),
          phone: z.string()
            .regex(/^[1-9]{2}9[0-9]{8}$/, 'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)')
            .optional(),
          password: z.string(),
        }).refine(data => data.email || data.phone, {
          message: 'É necessário fornecer email ou telefone'
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, phone, password } = request.body

      const userFromCredentials = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      })

      if (!userFromCredentials) {
        throw new BadRequestError('Invalid credentials.')
      }

      if (userFromCredentials.passwordHash === null) {
        throw new BadRequestError(
          'User does not have a password, use social login.',
        )
      }

      const isPasswordValid = await compare(
        password,
        userFromCredentials.passwordHash,
      )

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials.')
      }

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

      return reply.status(201).send({ token })
    },
  )
}
