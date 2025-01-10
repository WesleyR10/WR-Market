'use server'

import { Role } from '@wr-market/auth'
import { AxiosError } from 'axios'
import { revalidatePath } from 'next/cache'

import { createInvite } from '@/http/invite/create-invite'
import { revokeInvite } from '@/http/invite/revoke-invite'
import { getMembership } from '@/http/org/get-membership'
import { canManageRole } from '@/utils/role-hierarchy'

interface CreateInviteParams {
  email: string
  role: Role
  organizationSlug: string
}

export async function createInviteAction({
  email,
  role,
  organizationSlug,
}: CreateInviteParams) {
  try {
    // Obtém o role do usuário atual usando getMembership
    const { membership } = await getMembership(organizationSlug)
    const userRole = membership.role
    if (!canManageRole(userRole, role)) {
      return {
        success: false,
        error: 'Você não tem permissão para convidar usuários com este cargo',
      }
    }

    await createInvite({
      org: organizationSlug,
      email,
      role,
    })

    revalidatePath(`/org/${organizationSlug}/team/invites`)
    return { success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar convite',
      }
    }

    return {
      success: false,
      error: 'Erro ao criar convite',
    }
  }
}

export async function revokeInviteAction(
  organizationSlug: string,
  inviteId: string,
) {
  try {
    await revokeInvite({
      org: organizationSlug,
      inviteId,
    })

    revalidatePath(`/org/${organizationSlug}/team/invites`)
    return { success: true }
  } catch (error) {
    console.error('Erro ao revogar convite:', error)
    return {
      success: false,
      error: error || 'Erro ao revogar convite',
    }
  }
}

// Função para obter dados dos convites e permissões
export async function getInviteData(slug: string) {
  try {
    if (!slug) {
      return null
    }

    const { membership } = await getMembership(slug)

    return {
      membership,
    }
  } catch (error) {
    console.error('getInviteData - Error:', error)
    return null
  }
}
