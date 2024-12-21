import { api } from '../api-client'

interface SignInWithPasswordRequest {
  email?: string
  phone?: string
  password: string
  code?: string
}

interface SignInWithPasswordResponse {
  token?: string
  requiresTwoFactor?: boolean
  message?: string
  organization?: {
    slug: string
  }
}

export async function signInWithPassword({
  email,
  phone,
  password,
  code,
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        phone,
        password,
        code,
      },
    })
    .json<SignInWithPasswordResponse>()

  return result
}
