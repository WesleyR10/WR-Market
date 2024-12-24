import { NextRequest, NextResponse } from 'next/server'

// Lista de caminhos públicos que não requerem autenticação
const PUBLIC_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const org = request.cookies.get('org')?.value
  const response = NextResponse.next()

  // Se o caminho for público e o usuário estiver autenticado
  if (PUBLIC_PATHS.includes(pathname) && token) {
    const url = request.nextUrl.clone()

    if (org) {
      url.pathname = `/org/${org}/dashboard`
    } else {
      url.pathname = '/'
    }

    return NextResponse.redirect(url)
  }

  // Se o caminho não for público e o usuário não estiver autenticado, redirecione para '/auth/sign-in'
  if (!PUBLIC_PATHS.includes(pathname) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
