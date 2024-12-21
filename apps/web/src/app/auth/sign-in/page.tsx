'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { LoginForm } from './sign-in-form'

const LoginPage = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('refresh') === 'true') {
      window.location.href = '/auth/sign-in' // Força um refresh completo da página
    }
  }, [searchParams])
  return <LoginForm />
}

export default LoginPage
