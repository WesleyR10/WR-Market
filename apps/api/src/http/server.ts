import 'dotenv/config'
import { env } from '@wr-market/env'

import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  // jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
