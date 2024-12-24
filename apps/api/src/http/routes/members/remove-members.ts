import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { MemberDeleteNotAllowedError } from '@/errors/domain/member-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function removeMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Remove multiple members from the organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            memberIds: z.array(z.string().uuid()),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { memberIds } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'User')) {
          throw new MemberDeleteNotAllowedError()
        }

        // Usando transação para garantir que todos os membros sejam removidos ou nenhum
        await prisma.$transaction(async (tx) => {
          await tx.member.deleteMany({
            where: {
              id: { in: memberIds },
              organizationId: organization.id,
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
