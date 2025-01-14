import { MembershipStatus } from '@prisma/client'
import { Role, roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  MemberEmailRequiredError,
  MemberGetNotAllowedError,
  MemberNotFoundError,
} from '@/errors/domain/member-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

// Atualizando a interface para corresponder ao retorno do Prisma
interface PrismaMember {
  id: string
  role: Role
  status: MembershipStatus
  createdAt: Date
  user: {
    id: string
    name: string | null
    phone: string | null
    email: string | null // Permitindo null aqui
    avatarUrl: string | null
  }
}

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string(),
                  role: roleSchema,
                  status: z.enum(['ACTIVE', 'INACTIVE']),
                  createdAt: z.string(),
                  user: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    email: z.string(),
                    phone: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new MemberGetNotAllowedError()
        }

        const members = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            role: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            role: 'asc',
          },
        })

        if (!members || members.length === 0) {
          throw new MemberNotFoundError()
        }

        // Usando type assertion para garantir que email não é null
        const formattedMembers = members.map((member: PrismaMember) => {
          if (!member.user.email) {
            throw new MemberEmailRequiredError()
          }

          return {
            id: member.id,
            role: member.role,
            status: member.status,
            createdAt: dateUtils.toISO(member.createdAt),
            user: {
              id: member.user.id,
              name: member.user.name,
              email: member.user.email,
              phone: member.user.phone,
              avatarUrl: member.user.avatarUrl,
            },
          }
        })

        return reply.send({ members: formattedMembers })
      },
    )
}
