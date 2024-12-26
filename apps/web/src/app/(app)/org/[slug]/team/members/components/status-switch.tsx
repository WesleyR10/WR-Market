'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { convertStatus } from '@/lib/utils'

import { updateMemberAction } from '../actions'

interface StatusSwitchProps {
  checked: boolean
  orgSlug: string
  memberId: string
  userName: string
  disabled?: boolean
}

export function StatusSwitch({
  checked,
  orgSlug,
  memberId,
  userName,
  disabled,
}: StatusSwitchProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (newStatus: boolean) => {
      return updateMemberAction(orgSlug, memberId, {
        status: newStatus ? 'ACTIVE' : 'INACTIVE',
      })
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Status atualizado com sucesso',
          variant: 'default',
        })
        queryClient.invalidateQueries({
          queryKey: ['members', orgSlug],
        })
      } else {
        toast({
          title: 'Erro ao atualizar status',
          description: result.error,
          variant: 'destructive',
        })
      }
      setShowConfirmDialog(false)
    },
    onSettled: () => {
      setIsLoading(false)
      setPendingStatus(null)
    },
  })

  const handleStatusChange = (newStatus: boolean) => {
    setPendingStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (pendingStatus !== null) {
      updateStatus(pendingStatus)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id={`status-${memberId}`}
          checked={checked}
          onCheckedChange={handleStatusChange}
          disabled={disabled || isLoading}
        />
        <Label htmlFor={`status-${memberId}`}>
          {convertStatus(checked ? 'ACTIVE' : 'INACTIVE')}
        </Label>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de status</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja {pendingStatus ? 'ativar' : 'desativar'} o
              usuário {userName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
