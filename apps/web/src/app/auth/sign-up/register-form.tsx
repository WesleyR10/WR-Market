'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  BottomGradient,
  Header,
  InputWithLabel,
  SocialLoginButton,
} from '@/components/auth'
import { FormError } from '@/components/auth/form-error'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { RegisterSchema } from '@/schemas/auth'

import { registerAction } from './actions'

export const RegisterForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  type RegisterFormValues = z.infer<typeof RegisterSchema>
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      phone: '',
      password_confirmation: '',
      name: '',
    },
    mode: 'onChange',
  })

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      return registerAction(values)
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Você já pode fazer login no sistema.',
          variant: 'success',
        })
        router.push('/auth/sign-in')
        return
      }

      toast({
        variant: 'destructive',
        description: data?.message || 'Erro ao criar conta',
      })
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-none bg-emerald-100 p-4 shadow-input dark:bg-emerald-100 md:rounded-2xl md:p-8">
      <Header
        title="Seja bem vindo ao WR-Market"
        subtitle="Crie sua conta para começar a gerenciar seu negócio de forma eficiente."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 mt-8">
        <div className="mb-4 flex flex-col space-y-1 md:flex-row md:space-x-2 md:space-y-0">
          <InputWithLabel
            id="name"
            name="name"
            control={control}
            label="Nome completo"
            placeholder="John Doe"
            error={errors.name?.message}
          />
        </div>
        <InputWithLabel
          id="email"
          name="email"
          control={control}
          label="Endereço de email"
          placeholder="projectmayhem@fc.com"
          type="email"
          className="mb-4"
          error={errors.email?.message}
        />
        <InputWithLabel
          id="phone"
          name="phone"
          control={control}
          label="Telefone"
          placeholder="11912345678"
          type="tel"
          className="mb-4"
          error={errors.phone?.message}
        />
        <InputWithLabel
          id="password"
          name="password"
          control={control}
          label="Senha"
          placeholder="••••••••"
          type="password"
          className="mb-4"
          error={errors.password?.message}
        />
        <InputWithLabel
          id="password_confirmation"
          name="password_confirmation"
          control={control}
          label="Confirme sua senha"
          placeholder="••••••••"
          type="password"
          className="mb-8"
          error={errors.password_confirmation?.message}
        />

        <FormError message={errors.root?.message} />

        <Button
          className="group/btn relative block h-10 w-full rounded-md bg-emerald-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-emerald-700"
          type="submit"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            'Cadastrar'
          )}
          <BottomGradient />
        </Button>
      </form>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <div className="flex flex-col space-y-4">
        <SocialLoginButton />
      </div>

      <Button
        size="sm"
        variant="link"
        asChild
        className="mt-4 flex justify-center font-normal"
      >
        <Link href="/auth/sign-in">Já possuo uma conta</Link>
      </Button>
    </div>
  )
}
