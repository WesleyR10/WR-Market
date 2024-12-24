import { api } from '../api-client'

interface RemoveMembersRequest {
  org: string
  memberIds: string[]
}

export async function removeMembers({ org, memberIds }: RemoveMembersRequest) {
  await api.delete(`organizations/${org}/members`, {
    json: { memberIds },
  })
}
