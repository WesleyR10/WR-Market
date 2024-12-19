import { api } from '../api-client'

interface VerifyTwoFactorCodeParams {
  code: string
}

interface VerifyTwoFactorCodeResponse {
  token: string
}

export async function verifyTwoFactorCode({ code }: VerifyTwoFactorCodeParams) {
  const response = await api.post('two-factor/verify', {
    json: { code },
  })

  const data = await response.json<VerifyTwoFactorCodeResponse>()
  return data
}
