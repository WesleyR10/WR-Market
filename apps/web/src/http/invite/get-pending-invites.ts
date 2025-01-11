import type { PendingInvitesResponse } from '@/types/invite'

import { api } from '../api-client'

export async function getPendingInvites(): Promise<PendingInvitesResponse> {
  const response = await api
    .get('pending-invites')
    .json<PendingInvitesResponse>()
  return response
}
