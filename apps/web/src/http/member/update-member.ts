import { Role } from '@wr-market/auth'

import { api } from '../api-client'

interface UpdateMemberRequest {
  org: string
  memberId: string
  role?: Role
  status?: 'ACTIVE' | 'INACTIVE'
}

export async function updateMember({
  org,
  memberId,
  role,
  status,
}: UpdateMemberRequest) {
  await api.put(`organizations/${org}/members/${memberId}`, {
    json: { role, status },
  })
}
