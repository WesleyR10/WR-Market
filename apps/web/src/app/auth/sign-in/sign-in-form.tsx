'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  BottomGradient,
  Header,
  InputWithLabel,
  SocialLoginButton,
} from '@/components/auth'
import { CodeInput } from '@/components/auth/code-input'
import { FormError } from '@/components/auth/form-error'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { LoginSchema } from '@/schemas/auth'

import { loginActions } from './actions'

export const LoginForm = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')

  type LoginFormValues = z.infer<typeof LoginSchema>
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: async (data, context, options) => {
      if (loginMethod === 'email') {
        const { phone, ...rest } = data
        return zodResolver(LoginSchema)(rest, context, options)
      }
      if (loginMethod === 'phone') {
        const { email, ...rest } = data
        return zodResolver(LoginSchema)(rest, context, options)
      }
      return zodResolver(LoginSchema)(data, context, options)
    },
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      code: '',
    },
    mode: 'onChange',
  })

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      if (showTwoFactor) {
        // Envia apenas o código para verificação
        return loginActions({
          ...values,
          code: values.code,
        })
      }
      return loginActions(values)
    },
    onSuccess: (data) => {
      if (data?.requiresTwoFactor) {
        setShowTwoFactor(true)
        toast({
          title: data?.message,
          variant: 'success',
        })
        return
      }

      if (data?.success) {
        toast({
          title: 'Login realizado com sucesso!',
          variant: 'success',
        })
        router.push(data.redirectTo || '/')
        return
      }

      toast({
        variant: 'destructive',
        description: data?.message,
      })
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    const submitValues = showTwoFactor
      ? {
          ...values,
          code: values.code,
        }
      : loginMethod === 'email'
        ? { email: values.email, password: values.password }
        : { phone: values.phone, password: values.password }

    loginMutation.mutate(submitValues as LoginFormValues)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-none bg-emerald-100 p-4 shadow-input dark:bg-emerald-100 md:rounded-2xl md:p-8">
      {!showTwoFactor && (
        <Tabs defaultValue="email" className="mb-8 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" onClick={() => setLoginMethod('email')}>
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" onClick={() => setLoginMethod('phone')}>
              Telefone
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <Header
        title={
          showTwoFactor
            ? 'Verificação em duas etapas'
            : 'Seja bem vindo de volta'
        }
        subtitle={
          showTwoFactor
            ? 'Digite o código enviado para seu email.'
            : 'Acesse sua conta para gerenciar seu negócio.'
        }
        align={showTwoFactor ? 'center' : 'left'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 mt-8">
        {showTwoFactor ? (
          <CodeInput
            control={control}
            name="code"
            error={errors.code?.message}
            length={6}
            justify="center"
            className="mb-4"
          />
        ) : (
          <>
            {loginMethod === 'email' ? (
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
            ) : (
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
            )}
            <InputWithLabel
              id="password"
              name="password"
              control={control}
              label="Senha"
              placeholder="••••••••"
              type="password"
              className="mb-1"
              error={errors.password?.message}
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="link"
                asChild
                className="mb-3 w-auto px-0 font-semibold"
              >
                <Link href="/auth/forgot-password">Esqueci minha senha</Link>
              </Button>
            </div>
          </>
        )}

        <FormError message={errors.root?.message} />

        <Button
          className="group/btn relative block h-10 w-full rounded-md bg-emerald-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-emerald-700"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {showTwoFactor ? 'Verificar' : 'Entrar'}
          <BottomGradient />
        </Button>
      </form>

      {!showTwoFactor && (
        <>
          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <SocialLoginButton />
          </div>

          <Button
            size="sm"
            variant="link"
            asChild
            className="mt-4 flex justify-center font-semibold"
          >
            <Link href="/auth/sign-up">Não possui uma conta?</Link>
          </Button>
        </>
      )}
    </div>
  )
}
