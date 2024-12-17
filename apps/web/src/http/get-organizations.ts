import { Role } from '@wr-market/auth'

import { api } from './api-client'

interface Organization {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
  role: Role
}

export interface GetOrganizationsResponse {
  organizations: Organization[]
}

export async function getOrganizations() {
  const result = await api.get('organizations').json<GetOrganizationsResponse>()

  return result
}
