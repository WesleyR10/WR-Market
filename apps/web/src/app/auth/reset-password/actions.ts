'use server'

import { HTTPError } from 'ky'
import * as z from 'zod'

import { ResetPasswordSchema } from '@/schemas/auth'

import { resetPassword } from '../../../http/reset-password'

export const resetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema>,
  code: string,
) => {
  try {
    // Validação dos dados usando Zod
    const validatedFields = ResetPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const response = await resetPassword({
      code,
      password: validatedFields.data.newPassword,
    })

    return {
      success: response.success,
      message: response.message,
    }
  } catch (err) {
    console.error('Error in resetPasswordAction:', err)
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
      message: 'Erro inesperado, tente novamente mais tarde.',
      errors: null,
    }
  }
}
