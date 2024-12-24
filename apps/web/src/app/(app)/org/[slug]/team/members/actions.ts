'use server'

import { organizationSchema } from '@wr-market/auth'

import { getMembers } from '@/http/member/get-members'
import { getMembership } from '@/http/org/get-membership'
import { getOrganization } from '@/http/org/get-organization'

export async function getMembersData(slug: string) {
  if (!slug) {
    return null
  }

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(slug),
    getMembers(slug),
    getOrganization(slug),
  ])

  const authOrganization = organizationSchema.parse(organization)
  return {
    members,
    membership,
    organization: authOrganization,
  }
}
