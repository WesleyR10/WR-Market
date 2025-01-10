'use client'

import { Role } from '@wr-market/auth'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useInvites } from '@/hooks/use-invites'

import { getInviteData } from './actions'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { InviteDialog } from './components/invite-dialog'
import { InvitesHeader } from './components/invites-header'
// Definindo o tipo para os dados
type InviteDataType = {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
} | null

export default function InvitesPage() {
  const params = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [data, setData] = useState<InviteDataType>(null)
  const { data: invitesData, isLoading: isLoadingInvites } = useInvites()

  useEffect(() => {
    async function fetchData() {
      const inviteData = await getInviteData(params.slug as string)
      setData(inviteData)
    }
    fetchData()
  }, [params.slug])

  if (!data) {
    return null
  }

  return (
    <div className="flex h-full flex-col px-4">
      <div className="py-6">
        <h1 className="mb-1 text-3xl font-bold">Convites</h1>
        <p className="text-muted-foreground">
          Gerencie os convites da sua organização
        </p>
      </div>

      <InvitesHeader onOpenDialog={() => setIsDialogOpen(true)} />

      {isLoadingInvites ? (
        <div>Carregando convites...</div>
      ) : (
        <DataTable columns={columns} data={invitesData?.invites || []} />
      )}

      <InviteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userRole={data.membership.role}
      />
    </div>
  )
}
