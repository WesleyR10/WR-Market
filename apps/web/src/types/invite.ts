import { Role } from '@wr-market/auth'

export interface PendingInvite {
  id: string
  role: Role
  email: string
  createdAt: Date
  organization: {
    name: string
    slug: string
  }
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
}

export interface PendingInvitesResponse {
  invites: PendingInvite[]
}
