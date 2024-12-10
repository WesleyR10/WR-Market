import { env } from '@wr-market/env'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

import { AppError } from '@/errors/base/AppError'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Log do erro para observabilidade
  console.error({
    error: error.message,
    code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
    statusCode: error instanceof AppError ? error.statusCode : 500,
    stack: error.stack,
    path: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  })

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      details: error.details,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: 'VALIDATION_ERROR',
      message: 'Erro de validação',
      details: error.format(),
    })
  }

  const isProduction = env.NODE_ENV === 'production'

  return reply.status(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: isProduction ? 'Erro interno do servidor' : error.message,
    details: isProduction
      ? undefined
      : {
          name: error.name,
          stack: error.stack,
        },
  })
}
