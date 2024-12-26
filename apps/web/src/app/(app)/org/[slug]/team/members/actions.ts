'use server'

import { organizationSchema, Role } from '@wr-market/auth'
import { revalidatePath } from 'next/cache'

import { getMembers } from '@/http/member/get-members'
import { updateMember } from '@/http/member/update-member'
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

export async function updateMemberAction(
  org: string,
  memberId: string,
  data: { role?: Role; status?: 'ACTIVE' | 'INACTIVE' },
) {
  try {
    await updateMember({
      org,
      memberId,
      ...data,
    })

    revalidatePath(`/org/${org}/team/members`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao atualizar membro' }
  }
}
