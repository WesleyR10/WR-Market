import { roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { MemberUpdateNotAllowedError } from '@/errors/domain/member-errors'
import { RoleHierarchyError } from '@/errors/domain/role-errors'
import { auth } from '@/http/middlewares/auth'
import { roleHierarchyMiddleware } from '@/http/middlewares/role-hierarchy'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(roleHierarchyMiddleware)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema.optional(),
            status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'User')) {
          throw new MemberUpdateNotAllowedError()
        }

        const { role, status } = request.body

        if (role) {
          const canManageRole = request.canManageRole(membership.role, role)
          if (!canManageRole) {
            throw new RoleHierarchyError()
          }
        }

        if (status) {
          const targetMember = await prisma.member.findUnique({
            where: { id: memberId },
            select: { role: true },
          })

          const canManageStatus = request.canManageRole(
            membership.role,
            targetMember?.role,
          )
          if (!canManageStatus) {
            throw new RoleHierarchyError()
          }
        }

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: {
            ...(status && { status }),
            ...(role && { role }),
          },
        })

        return reply.status(204).send()
      },
    )
}
