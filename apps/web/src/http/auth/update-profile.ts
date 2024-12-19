import { api } from '../api-client'

export interface UpdateProfileRequest {
  name?: string | null
  email?: string | null
  phone?: string | null
  avatarUrl?: string | null
  isTwoFactorEnabled?: boolean
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
}

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  const result = await api
    .put('profile', { json: data })
    .json<UpdateProfileResponse>()

  return result
}
