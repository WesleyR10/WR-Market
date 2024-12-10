import { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '@/errors/domain/auth-errors'

declare module 'fastify' {
  interface FastifyRequest {
    getClientId(): Promise<string>
  }
}

export const clientAuth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getClientId = async () => {
      try {
        const token = await request.jwtVerify<{ sub: string; type: 'client' }>()

        if (token.type !== 'client') {
          throw new UnauthorizedError()
        }

        return token.sub
      } catch (err) {
        console.log(err)
        throw new UnauthorizedError()
      }
    }
  })
})
