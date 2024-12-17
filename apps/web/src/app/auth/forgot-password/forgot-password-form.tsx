'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Header, InputWithLabel } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { ResetSchema } from '@/schemas/auth'

import { forgotPasswordAction } from './actions'

export const ForgotPasswordForm = () => {
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'phone'>(
    'email',
  )

  type ForgotPasswordValues = z.infer<typeof ResetSchema>
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: async (data, context, options) => {
      if (recoveryMethod === 'email') {
        const { phone, ...rest } = data
        return zodResolver(ResetSchema)(rest, context, options)
      }
      if (recoveryMethod === 'phone') {
        const { email, ...rest } = data
        return zodResolver(ResetSchema)(rest, context, options)
      }
      return zodResolver(ResetSchema)(data, context, options)
    },
    defaultValues: {
      email: '',
      phone: '',
    },
    mode: 'onChange',
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordAction,
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: data.message,
          variant: 'success',
        })
        return
      }

      toast({
        variant: 'destructive',
        description: data?.message,
      })
    },
  })

  const onSubmit = (values: ForgotPasswordValues) => {
    const submitValues =
      recoveryMethod === 'email'
        ? { email: values.email }
        : { phone: values.phone }

    forgotPasswordMutation.mutate(submitValues)
  }

  const toggleMethod = () => {
    setRecoveryMethod((current) => (current === 'email' ? 'phone' : 'email'))
    reset()
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
        title="Esqueceu sua senha?"
        subtitle="Não se preocupe! Digite seu endereço de email abaixo e enviaremos um link para você redefinir sua senha."
        align="left"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4 flex justify-start">
          <Button
            type="button"
            variant="link"
            onClick={toggleMethod}
            className="h-auto p-0 text-sm font-normal text-emerald-600 hover:text-emerald-700"
          >
            {recoveryMethod === 'email'
              ? 'Recuperar com telefone'
              : 'Recuperar com email'}
          </Button>
        </div>

        {recoveryMethod === 'email' ? (
          <InputWithLabel
            id="email"
            name="email"
            control={control}
            label="Endereço de email"
            placeholder="seuemail@exemplo.com"
            type="email"
            error={errors.email?.message}
          />
        ) : (
          <InputWithLabel
            id="phone"
            name="phone"
            control={control}
            label="Telefone"
            placeholder="11912345678"
            type="tel"
            error={errors.phone?.message}
          />
        )}

        <Button
          className="group/btn relative mt-4 block h-10 w-full rounded-md bg-emerald-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-emerald-700"
          type="submit"
        >
          Recuperar senha
        </Button>
      </form>
    </div>
  )
}
