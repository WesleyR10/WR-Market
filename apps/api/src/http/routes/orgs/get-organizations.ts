import { roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

interface Organization {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
  createdAt: Date
  members: {
    role:
      | 'ADMIN'
      | 'GERENTE_GERAL'
      | 'GERENTE_VENDAS'
      | 'GERENTE_ESTOQUE'
      | 'VENDEDOR'
      | 'ESTOQUISTA'
      | 'ENTREGADOR'
  }[]
}

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations where user is a member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                  createdAt: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            createdAt: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...org }: Organization) => {
            return {
              ...org,
              role: members[0].role as Organization['members'][0]['role'],
              createdAt: dateUtils.toISO(org.createdAt),
            }
          },
        )

        return { organizations: organizationsWithUserRole }
      },
    )
}
