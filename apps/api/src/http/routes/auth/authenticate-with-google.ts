import { env } from '@wr-market/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  GoogleAuthFailedError,
  GoogleEmailRequiredError,
} from '@/errors/domain/auth-errors'
import { prisma } from '@/lib/prisma'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { code } = request.body // Código retornado pelo Google vindo do front-end

        const googleOAuthURL = new URL('https://oauth2.googleapis.com/token')

        googleOAuthURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
        googleOAuthURL.searchParams.set(
          'client_secret',
          env.GOOGLE_OAUTH_CLIENT_SECRET,
        )
        googleOAuthURL.searchParams.set(
          'redirect_uri',
          env.GOOGLE_OAUTH_REDIRECT_URI,
        )
        googleOAuthURL.searchParams.set('code', code)
        googleOAuthURL.searchParams.set('grant_type', 'authorization_code')

        const googleAccessTokenResponse = await fetch(googleOAuthURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        })

        if (!googleAccessTokenResponse.ok) {
          throw new GoogleAuthFailedError()
        }

        const googleAccessTokenData = await googleAccessTokenResponse.json()

        const { access_token: googleAccessToken } = z
          .object({
            access_token: z.string(),
            token_type: z.literal('Bearer'),
            scope: z.string(),
          })
          .parse(googleAccessTokenData)

        const googleUserResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          },
        )

        if (!googleUserResponse.ok) {
          throw new GoogleAuthFailedError()
        }

        const googleUserData = await googleUserResponse.json()

        const {
          id: googleId,
          name,
          email,
          picture: avatarUrl,
        } = z
          .object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            picture: z.string().url(),
            verified_email: z.boolean(),
          })
          .parse(googleUserData)

        if (!email) {
          throw new GoogleEmailRequiredError()
        }

        let user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              avatarUrl,
            },
          })
        }

        let account = await prisma.account.findUnique({
          where: {
            provider_userId: {
              provider: 'GOOGLE',
              userId: user.id,
            },
          },
        })

        if (!account) {
          account = await prisma.account.create({
            data: {
              provider: 'GOOGLE',
              providerAccountId: googleId,
              userId: user.id,
            },
          })
        }

        const token = await reply.jwtSign(
          {
            sub: user.id,
          },
          {
            sign: {
              expiresIn: '7d',
            },
          },
        )

        return reply.status(201).send({ token })
      } catch (error) {
        if (
          error instanceof GoogleAuthFailedError ||
          error instanceof GoogleEmailRequiredError
        ) {
          throw error
        }
        throw new GoogleAuthFailedError()
      }
    },
  )
}
