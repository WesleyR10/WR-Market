import { roleSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  InviteCreateNotAllowedError,
  InviteEmailInUseError,
  InviteInvalidDomainError,
  InviteMemberExistsError,
} from '@/errors/domain/invite-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
            400: z.object({
              message: z.string(),
            }),
            403: z.object({
              message: z.string(),
            }),
            404: z.object({
              message: z.string(),
            }),
            409: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { email, role } = request.body
        const userId = await request.getCurrentUserId()

        try {
          const { organization, membership } =
            await request.getUserMembership(slug)

          // Verificar se já existe um convite pendente
          await prisma.invite.findUnique({
            where: {
              email_organizationId: {
                email,
                organizationId: organization.id,
              },
            },
          })

          const { cannot } = getUserPermissions(userId, membership.role)

          if (cannot('create', 'Invite')) {
            throw new InviteCreateNotAllowedError()
          }

          const [, domain] = email.split('@')

          // Corrigindo a lógica de validação do domínio
          if (
            organization.shouldAttachUsersByDomain &&
            domain === organization.domain // Se o domínio for igual ao da organização
          ) {
            throw new InviteInvalidDomainError()
          }

          const inviteWithSameEmail = await prisma.invite.findUnique({
            where: {
              email_organizationId: {
                email,
                organizationId: organization.id,
              },
            },
          })

          if (inviteWithSameEmail) {
            throw new InviteEmailInUseError()
          }

          const existingUser = await prisma.user.findUnique({
            where: {
              email,
            },
            include: {
              member_on: {
                where: {
                  organizationId: organization.id,
                },
              },
            },
          })
          // Se o usuário já é membro da organização
          if (
            existingUser &&
            existingUser.member_on &&
            existingUser.member_on.length > 0
          ) {
            throw new InviteMemberExistsError()
          }

          // TODO: Implementar a lógica de envio de convite para email caso usuário não exista no sistema

          const invite = await prisma.invite.create({
            data: {
              email,
              role,
              organization: {
                connect: {
                  id: organization.id,
                },
              },
              author: {
                connect: {
                  id: membership.id,
                },
              },
            },
          })

          return reply.status(201).send({ inviteId: invite.id })
        } catch (error) {
          console.error('Erro ao criar convite na API:', error)
          throw error
        }
      },
    )
}
