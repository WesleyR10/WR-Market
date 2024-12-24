import { Role } from '@wr-market/auth'

import { api } from '../api-client'

interface GetMembersResponse {
  members: {
    id: string
    userId: string
    role: Role
    status: 'ACTIVE' | 'INACTIVE'
    name: string | null
    email: string
    phone: string | null
    avatarUrl: string | null
  }[]
}

export async function getMembers(org: string) {
  const result = await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<GetMembersResponse>()

  return result
}
