import { api } from '../api-client'

interface SignUpRequest {
  name: string
  email: string
  phone: string
  password: string
}

type SignUpResponse = void

export async function signUp({
  name,
  email,
  phone,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('users', {
    json: {
      name,
      email,
      phone,
      password,
    },
  })
}
