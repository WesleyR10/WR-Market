'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Role } from '@wr-market/auth'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getRoleLabel } from '@/lib/utils'
import { ASSIGNABLE_ROLES } from '@/utils/role-hierarchy'

import { createInviteAction } from '../actions'

const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum([
    'GERENTE_GERAL',
    'GERENTE_VENDAS',
    'GERENTE_ESTOQUE',
    'VENDEDOR',
    'ESTOQUISTA',
    'ENTREGADOR',
  ]),
})

type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: Role
}

export function InviteDialog({
  open,
  onOpenChange,
  userRole,
}: InviteDialogProps) {
  const params = useParams()
  const queryClient = useQueryClient()
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: undefined,
    },
  })
  const { toast } = useToast()

  async function onSubmit(data: InviteFormValues) {
    const result = await createInviteAction({
      email: data.email,
      role: data.role,
      organizationSlug: params.slug as string,
    })

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['invites', params.slug] })

      toast({
        title: 'Convite enviado com sucesso',
        description: 'O convite foi enviado para o email fornecido.',
        variant: 'success',
      })
      form.reset()
      onOpenChange(false)
    } else {
      toast({
        title: 'Erro ao enviar convite',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const availableRoles = ASSIGNABLE_ROLES[userRole] || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Convite</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo membro da organização
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {getRoleLabel(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Enviar convite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
