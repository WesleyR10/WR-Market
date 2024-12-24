import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/org/accept-invite'
import { signInWithGoogle } from '@/http/sign-in-with-google'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Google OAuth  code was not found.' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGoogle({ code })

  cookies().set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7days
  })

  const inviteId = cookies().get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
      cookies().delete('inviteId')
    } catch (error) {
      console.error('Erro ao aceitar convite:', error)
    }
  }

  const redirectUrl = request.nextUrl.clone() // Clono a URL atual "https://localhost:3000/api/auth/callback?code=..."

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
