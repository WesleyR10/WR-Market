'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Role } from '@wr-market/auth'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

import { updateMemberAction } from '../actions'

const roles = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Gerente Geral', value: 'GERENTE_GERAL' },
  { label: 'Gerente de Vendas', value: 'GERENTE_VENDAS' },
  { label: 'Gerente de Estoque', value: 'GERENTE_ESTOQUE' },
  { label: 'Vendedor', value: 'VENDEDOR' },
  { label: 'Estoquista', value: 'ESTOQUISTA' },
  { label: 'Entregador', value: 'ENTREGADOR' },
] as const

interface RoleSelectProps {
  value: Role
  orgSlug: string
  memberId: string
  userName: string // Adicionando nome do usuário para o dialog
  assignableRoles: Role[]
  disabled?: boolean
}

export function RoleSelect({
  value,
  orgSlug,
  memberId,
  userName,
  assignableRoles,
  disabled,
}: RoleSelectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Encontra o label da role atual
  const currentRole = roles.find((role) => role.value === value)

  // Filtra apenas as roles que podem ser atribuídas
  const availableRoles = roles.filter((role) =>
    assignableRoles.includes(role.value),
  )

  const { mutate: updateRole } = useMutation({
    mutationFn: async (newRole: Role) => {
      return updateMemberAction(orgSlug, memberId, {
        role: newRole,
      })
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Função atualizada com sucesso',
          variant: 'default',
        })
        queryClient.invalidateQueries({
          queryKey: ['members', orgSlug],
        })
      } else {
        toast({
          title: 'Erro ao atualizar função',
          description: result.error,
          variant: 'destructive',
        })
      }
      setShowConfirmDialog(false)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  const handleRoleSelect = (newRole: Role) => {
    setSelectedRole(newRole)
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (selectedRole) {
      updateRole(selectedRole)
    }
  }

  return (
    <>
      <Select
        value={value}
        onValueChange={(newRole: Role) => handleRoleSelect(newRole)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue>{currentRole?.label || 'Selecionar função'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de função</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja alterar a função de {userName} de{' '}
              {currentRole?.label} para{' '}
              {roles.find((r) => r.value === selectedRole)?.label}?
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
