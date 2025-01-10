import { Role } from '@wr-market/auth'

export interface Invite {
  id: string
  role: Role
  email: string
  createdAt: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  expiresAt: string
  author: {
    id: string
    name: string | null
  } | null
}
