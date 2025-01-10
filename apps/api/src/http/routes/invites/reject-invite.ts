import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserNotFoundError } from '@/errors/domain/auth-errors'
import {
  InviteBelongsToAnotherUserError,
  InviteNotFoundError,
} from '@/errors/domain/invite-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/reject',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Reject an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { inviteId } = request.params

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new InviteNotFoundError()
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new UserNotFoundError()
        }

        if (invite.email !== user.email) {
          throw new InviteBelongsToAnotherUserError()
        }

        await prisma.invite.delete({
          where: {
            id: invite.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
