'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Bell, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePendingInvites } from '@/hooks/use-pending-invites'
import { useToast } from '@/hooks/use-toast'
import { acceptInvite } from '@/http/invite/accept-invite'
import { rejectInvite } from '@/http/invite/reject-invite'
import { getRoleLabel } from '@/lib/utils'

export function CompactInvites() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: pendingInvites } = usePendingInvites()

  const handleAcceptInvite = async (inviteId: string, orgSlug: string) => {
    try {
      await acceptInvite(inviteId)
      await queryClient.invalidateQueries({ queryKey: ['pendingInvites'] })
      toast({
        title: 'Convite aceito com sucesso!',
        variant: 'success',
      })
      router.push(`/org/${orgSlug}/dashboard`)
    } catch (error) {
      toast({
        title: 'Erro ao aceitar convite',
        variant: 'destructive',
      })
    }
  }

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId)
      await queryClient.invalidateQueries({ queryKey: ['pendingInvites'] })
      toast({
        title: 'Convite rejeitado',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro ao rejeitar convite',
        variant: 'destructive',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {pendingInvites?.invites && pendingInvites?.invites.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {pendingInvites.invites.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium">Convites Pendentes</h4>
          {!pendingInvites?.invites.length ? (
            <div className="py-3 text-center">
              <p className="text-sm text-muted-foreground">
                Você não possui convites pendentes
              </p>
            </div>
          ) : (
            pendingInvites.invites.map((invite) => (
              <div key={invite.id} className="mb-2">
                <div className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-accent">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {invite.organization.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cargo: {getRoleLabel(invite.role)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
                      onClick={() =>
                        handleAcceptInvite(invite.id, invite.organization.slug)
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => handleRejectInvite(invite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
