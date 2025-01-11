'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CompactInvites } from './compact-invites'

interface InvitesHeaderProps {
  onOpenDialog: () => void
}

export function InvitesHeader({ onOpenDialog }: InvitesHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="ml-auto flex items-center gap-4">
        <Button onClick={onOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Convite
        </Button>
        <CompactInvites />
      </div>
    </div>
  )
}
