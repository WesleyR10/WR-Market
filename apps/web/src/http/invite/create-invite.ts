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
    console.log('Iniciando criação de convite:', { org, email, role })

    const response = await api
      .post(`organizations/${org}/invites`, {
        json: {
          email,
          role,
        },
      })
      .json()

    console.log('Resposta do servidor:', response)

    return {
      success: true,
      data: response as KyResponse<unknown>,
    }
  } catch (error: any) {
    console.error('Erro detalhado:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      body: await error.response?.json().catch(() => ({})),
    })
    const errorMessage = await error.response
      ?.json()
      .catch(() => ({ message: 'Erro ao criar convite' }))

    return {
      success: false,
      error: errorMessage.message || 'Erro ao criar convite',
    }
  }
}
