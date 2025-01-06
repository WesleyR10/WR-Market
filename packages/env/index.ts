import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().default(3334),
    WEB_PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    HASH_ROUNDS: z.coerce.number().default(6),
    JWT_SECRET: z.string().min(1),

    // Google OAuth
    GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
    GOOGLE_OAUTH_REDIRECT_URI: z.string().url(),

    // Cloudflare R2
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL: z.string().url(),
  },
  shared: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.SERVER_PORT,
    WEB_PORT: process.env.WEB_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    HASH_ROUNDS: process.env.HASH_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL:
      process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL,
    // Google OAuth
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,

    // Cloudflare R2
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  },
  emptyStringAsUndefined: true,
})
