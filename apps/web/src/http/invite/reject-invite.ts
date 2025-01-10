import { api } from '../api-client'

export async function rejectInvite(inviteId: string) {
  const response = await api.post(`invites/${inviteId}/reject`).json()
  return response
}
