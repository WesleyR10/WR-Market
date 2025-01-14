import { env } from '@wr-market/env'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { CpfInUseError, EmailInUseError } from '@/errors/domain/client-errors'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function createClientAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/clients',
    {
      schema: {
        tags: ['Client'],
        summary: 'Create a new client account',
        body: z
          .object({
            name: z.string(),
            email: z.string().email().optional(),
            phone: z
              .string()
              .regex(/^[1-9]{2}9[0-9]{8}$/)
              .optional(),
            cpf: z.string().length(11).optional(),
            password: z.string().min(6),
            birthDate: z.string().datetime().optional(),
            avatarUrl: z.string().url().optional(),
            address: z
              .object({
                street: z.string(),
                number: z.string(),
                district: z.string(),
                city: z.string(),
                state: z.string(),
                zipCode: z.string(),
              })
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
      const {
        name,
        email,
        phone,
        cpf,
        password,
        birthDate,
        avatarUrl,
        address,
      } = request.body

      if (email) {
        const clientWithSameEmail = await prisma.client.findUnique({
          where: { email },
        })

        if (clientWithSameEmail) {
          throw new EmailInUseError()
        }
      }

      if (cpf) {
        const clientWithSameCPF = await prisma.client.findUnique({
          where: { cpf },
        })

        if (clientWithSameCPF) {
          throw new CpfInUseError()
        }
      }

      const passwordHash = await hash(password, env.HASH_ROUNDS)

      await prisma.client.create({
        data: {
          name,
          email,
          phone,
          cpf,
          passwordHash,
          birthDate: birthDate ? dateUtils.toDate(birthDate) : undefined,
          avatarUrl,
          isActive: true,
          addresses: address
            ? {
                create: {
                  ...address,
                  isMain: true,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
