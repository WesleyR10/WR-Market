'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Header, InputWithLabel } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { ResetPasswordSchema } from '@/schemas/auth'

import { resetPasswordAction } from './actions'

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const router = useRouter()

  type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (values: ResetPasswordValues) =>
      resetPasswordAction(values, code ?? ''),
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: data.message,
          variant: 'success',
        })
        router.push('/auth/sign-in')
        return
      }

      toast({
        variant: 'destructive',
        description: data?.message,
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: 'Erro ao resetar a senha. Tente novamente.',
      })
    },
  })

  const onSubmit = (values: ResetPasswordValues) => {
    resetPasswordMutation.mutate(values)
  }

  return (
    <div className="w-full max-w-md rounded-none bg-emerald-100 p-4 shadow-input dark:bg-emerald-100 md:rounded-2xl md:p-8">
      <Button
        variant="link"
        asChild
        className="mb-3 justify-start px-0 font-semibold text-emerald-600"
      >
        <Link href="/auth/sign-in" className="flex w-full gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <Header
        title="Redefinir Senha"
        subtitle="Digite sua nova senha abaixo."
        align="left"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-2"
      >
        <InputWithLabel
          id="newPassword"
          name="newPassword"
          control={control}
          label="Nova Senha"
          placeholder="••••••••"
          type="password"
          error={errors.newPassword?.message}
        />

        <InputWithLabel
          id="confirmPassword"
          name="confirmPassword"
          control={control}
          label="Confirmar Senha"
          placeholder="••••••••"
          type="password"
          error={errors.confirmPassword?.message}
        />

        <Button
          className="group/btn relative mt-4 block h-10 w-full rounded-md bg-emerald-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-emerald-700"
          type="submit"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            'Redefinir Senha'
          )}
        </Button>
      </form>
    </div>
  )
}
