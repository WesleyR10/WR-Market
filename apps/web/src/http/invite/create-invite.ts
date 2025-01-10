import { Role } from '@wr-market/auth'
import { KyResponse } from 'ky'

import { api } from '../api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: Role
}

type CreateInviteResponse = {
  success: boolean
  error?: string
  data?: KyResponse<unknown>
}

export async function createInvite({
  org,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  try {
    const response = await api
      .post(`organizations/${org}/invites`, {
        json: {
          email,
          role,
        },
      })
      .json()

    return {
      success: true,
      data: response as KyResponse<unknown>,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao criar convite',
    }
  }
}
