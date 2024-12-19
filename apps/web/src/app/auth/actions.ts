'use server'

import { env } from '@wr-market/env'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const googleSignInURL = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth',
  )

  googleSignInURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  googleSignInURL.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_REDIRECT_URI,
  )
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'email profile')
  googleSignInURL.searchParams.set('access_type', 'offline')
  googleSignInURL.searchParams.set('prompt', 'consent')

  redirect(googleSignInURL.toString())
}
