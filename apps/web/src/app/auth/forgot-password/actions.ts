'use server'

import { HTTPError } from 'ky'
import * as z from 'zod'

import { requestPasswordRecover } from '@/http/request-password-recover'
import { ResetSchema } from '@/schemas/auth'

export const forgotPasswordAction = async (
  values: z.infer<typeof ResetSchema>,
) => {
  try {
    const validatedFields = ResetSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    await requestPasswordRecover({
      email: validatedFields.data.email,
      phone: validatedFields.data.phone,
    })

    return {
      success: true,
      message:
        'Se existe uma conta com este email, enviaremos instruções para redefinir sua senha.',
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
