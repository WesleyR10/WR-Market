import { api } from '../api-client'

interface RequestPasswordRecoverParams {
  email?: string
  phone?: string
}

interface RequestPasswordRecoverResponse {
  message?: string
}

export async function requestPasswordRecover({
  email,
  phone,
}: RequestPasswordRecoverParams): Promise<RequestPasswordRecoverResponse> {
  const response = await api
    .post('password/recover', {
      json: {
        email,
        phone,
      },
    })
    .json<RequestPasswordRecoverResponse>()

  return response
}
