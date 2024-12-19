'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import * as z from 'zod'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithPassword } from '@/http/auth/sign-in-with-password'
import { verifyTwoFactorCode } from '@/http/auth/verify-two-factor-code'
import { LoginSchema } from '@/schemas/auth'

export const loginActions = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
    // Se já temos código, vamos direto para verificação 2FA
    if (values.code) {
      console.log('Verificando 2FA:', {
        code: values.code,
      })

      const verifyResponse = await verifyTwoFactorCode({
        code: values.code,
      })

      if (verifyResponse.token) {
        cookies().set('token', verifyResponse.token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        return { success: true }
      }
    }

    const { email, phone, password } = validatedFields.data
    // Caso contrário, tenta login normal
    const response = await signInWithPassword({
      email,
      phone,
      password,
    })

    // Se precisar de 2FA
    if (response.requiresTwoFactor) {
      return {
        success: false,
        requiresTwoFactor: true,
        message: response.message,
      }
    }

    // Login normal bem sucedido
    if (response.token) {
      cookies().set('token', response.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return { success: true }
    }

    const inviteId = cookies().get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        cookies().delete('inviteId')
      } catch (e) {
        console.log(e)
      }
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorData = (await err.response.json()) as { message: string }
      return {
        success: false,
        message: errorData.message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }
}
