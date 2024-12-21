import { env } from '@wr-market/env'
import { getCookie } from 'cookies-next'
import { CookiesFn } from 'cookies-next/lib/types'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        // Verificar se o código está rodando no servidor ou no navegador
        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')

          cookieStore = serverCookies
        }
        const token = getCookie('token', { cookies: cookieStore })
        console.log('Token being sent:', token)

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
