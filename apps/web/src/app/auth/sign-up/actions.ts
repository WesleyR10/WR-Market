'use server'

import { HTTPError } from 'ky'
import * as z from 'zod'

import { signUp } from '@/http/auth/sign-up'
import { RegisterSchema } from '@/schemas/auth'

export const registerAction = async (
  values: z.infer<typeof RegisterSchema>,
) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, phone, password } = validatedFields.data

    // Tenta realizar o registro
    await signUp({
      name,
      email,
      phone,
      password,
    })

    // Se chegou aqui, o registro foi bem sucedido
    return {
      success: true,
      message: 'Conta criada com sucesso!',
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
