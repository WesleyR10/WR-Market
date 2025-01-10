import { Role } from '@wr-market/auth'

import { api } from '../api-client'

interface ListInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function listInvites(org: string) {
  return await api
    .get(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<ListInvitesResponse>()
}
