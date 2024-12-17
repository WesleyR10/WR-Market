'use server'

// import { env } from '@wr-market/env'
import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

  // githubSignInURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  // githubSignInURL.searchParams.set(
  //   'redirect_uri',
  //   env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  // )
  // githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}
