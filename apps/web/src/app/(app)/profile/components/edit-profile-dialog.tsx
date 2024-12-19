'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { InputWithLabel } from '@/components/auth'
import { FormError } from '@/components/auth/form-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const ProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z
    .string()
    .regex(
      /^[1-9]{2}9[0-9]{8}$/,
      'Formato inválido. Use: DDD + 9 + 8 dígitos (Ex: 11912345678)',
    )
    .optional(),
  isTwoFactorEnabled: z.boolean().optional(),
})

type ProfileFormValues = z.infer<typeof ProfileSchema>

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ProfileFormValues) => void
  defaultValues: Partial<ProfileFormValues>
  isPending: boolean
}

export function EditProfileDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isPending,
}: EditProfileDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  })

  const onChange = (checked: boolean) => {
    console.log('onChange checked', checked)
  }

  const onSubmitHandler = (data: ProfileFormValues) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <InputWithLabel
            id="name"
            name="name"
            control={control}
            label="Nome completo"
            placeholder="John Doe"
            error={errors.name?.message}
          />

          <InputWithLabel
            id="email"
            name="email"
            control={control}
            label="Endereço de email"
            placeholder="john@example.com"
            type="email"
            error={errors.email?.message}
          />

          <InputWithLabel
            id="phone"
            name="phone"
            control={control}
            label="Telefone"
            placeholder="11912345678"
            type="tel"
            error={errors.phone?.message}
          />

          <div className="flex items-center">
            <Switch
              id="twoFactorEnabled"
              checked={defaultValues.isTwoFactorEnabled}
              onCheckedChange={onChange}
            />
            <Label htmlFor="twoFactorEnabled" className="ml-2">
              Ativar autenticação de dois fatores
            </Label>
          </div>
          <FormError message={errors.root?.message} />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
