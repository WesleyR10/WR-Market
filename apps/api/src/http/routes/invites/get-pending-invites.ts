import { roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserNotFoundError } from '@/errors/domain/auth-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all user pending invites',
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  role: roleSchema,
                  email: z.string().email(),
                  createdAt: z.string(),
                  organization: z.object({
                    name: z.string(),
                    slug: z.string(),
                  }),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                      avatarUrl: z.string().url().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new UserNotFoundError()
        }

        const invites = await prisma.invite.findMany({
          where: {
            email: user.email ?? '',
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            organization: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        })

        // Formatar os dados para corresponder ao schema
        const formattedInvites = invites.map((invite) => ({
          id: invite.id,
          email: invite.email,
          role: invite.role,
          createdAt: dateUtils.toISO(invite.createdAt),
          organization: {
            name: invite.organization.name,
            slug: invite.organization.slug,
          },
          author: invite.author
            ? {
                id: invite.author.id,
                name: invite.author.user?.name || null,
                avatarUrl: invite.author.user?.avatarUrl || null,
              }
            : null,
        }))

        return { invites: formattedInvites }
      },
    )
}
