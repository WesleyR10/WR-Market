'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface InvitesHeaderProps {
  onOpenDialog: () => void
}

export function InvitesHeader({ onOpenDialog }: InvitesHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button onClick={onOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Convite
        </Button>
      </div>
    </div>
  )
}
