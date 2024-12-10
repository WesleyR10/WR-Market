import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),
    HASH_ROUNDS: z.coerce.number().default(6),

    JWT_SECRET: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    HASH_ROUNDS: process.env.HASH_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
})
