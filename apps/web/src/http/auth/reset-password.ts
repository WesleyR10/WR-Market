import { api } from '../api-client'

interface ResetPasswordRequest {
  code: string
  password: string
}

interface ResetPasswordResponse {
  success: boolean
  message: string
}

export async function resetPassword({
  code,
  password,
}: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const result = await api
    .post('password/reset', {
      json: { code, password },
    })
    .json<ResetPasswordResponse>()

  return result
}
