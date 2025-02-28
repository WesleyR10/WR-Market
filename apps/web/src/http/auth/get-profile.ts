import { api } from '../api-client'

export interface GetProfileResponse {
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
    isTwoFactorEnabled: boolean
    avatarUrl: string | null
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()

  return result
}
