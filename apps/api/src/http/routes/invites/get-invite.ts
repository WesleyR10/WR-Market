import { roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { InviteNotFoundError } from '@/errors/domain/invite-errors'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get an invite',
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string().uuid(),
              role: roleSchema,
              email: z.string().email(),
              createdAt: z.string(),
              organization: z.object({
                name: z.string(),
              }),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
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
            },
          },
        },
      })

      if (!invite) {
        throw new InviteNotFoundError()
      }

      return {
        invite: {
          id: invite.id,
          role: invite.role,
          email: invite.email,
          createdAt: dateUtils.toISO(invite.createdAt),
          organization: {
            name: invite.organization.name,
          },
          author: invite.author
            ? {
                id: invite.author.id,
                name: invite.author.user?.name ?? null,
                avatarUrl: invite.author.user?.avatarUrl ?? null,
              }
            : null,
        },
      }
    },
  )
}
