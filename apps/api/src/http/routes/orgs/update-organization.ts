import { Prisma } from '@prisma/client'
import { organizationSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  OrganizationDomainInUseError,
  OrganizationUpdateNotAllowedError,
} from '@/errors/domain/organization-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update organization details',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { name, domain, shouldAttachUsersByDomain } = request.body

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse(organization)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new OrganizationUpdateNotAllowedError()
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: {
                not: organization.id,
              },
            },
          })

          if (organizationByDomain) {
            throw new OrganizationDomainInUseError()
          }
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const updated = await tx.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              name,
              domain,
              shouldAttachUsersByDomain,
            },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Organization',
              entityId: organization.id,
              changes: {
                old: {
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                },
                new: {
                  name: updated.name,
                  domain: updated.domain,
                  shouldAttachUsersByDomain: updated.shouldAttachUsersByDomain,
                },
              },
              createdAt: dateUtils.toDate(new Date()),
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
