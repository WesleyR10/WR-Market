import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'

export async function authenticateClient(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/clients/sessions',
    {
      schema: {
        tags: ['Client'],
        summary: 'Authenticate client with email/phone & password',
        body: z.object({
          email: z.string().email().optional(),
          phone: z.string()
            .regex(/^[1-9]{2}9[0-9]{8}$/)
            .optional(),
          password: z.string(),
        }).refine(data => data.email || data.phone, {
          message: 'É necessário fornecer email ou telefone'
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, phone, password } = request.body

      const client = await prisma.client.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          isActive: true,
        },
      })

      if (!client || !client.passwordHash) {
        throw new BadRequestError('Invalid credentials')
      }

      const isPasswordValid = await compare(password, client.passwordHash)

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials')
      }

      const token = await reply.jwtSign(
        {
          sub: client.id,
          type: 'client',
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