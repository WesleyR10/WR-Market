import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/sign-in'
  redirectUrl.searchParams.set('refresh', 'true') // Adicionar um parâmetro para identificar que precisa de refresh

  cookies().delete('token')
  cookies().delete('org')

  return NextResponse.redirect(redirectUrl)
}
