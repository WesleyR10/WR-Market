import { roleSchema } from '@wr-market/auth'
import * as z from 'zod'

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: roleSchema,
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  )

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
})

export const ResetSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Email é inválido',
      })
      .optional(),
    phone: z
      .string()
      .regex(
        /^[1-9]{2}9[0-9]{8}$/,
        'Formato: DDD + 9 + 8 dígitos (Ex: 11912345678)',
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe seu email ou telefone',
        path: ['email'],
      })
    }
  })

export const LoginSchema = z
  .object({
    email: z.string().email({ message: 'Email inválido' }).optional(),
    phone: z
      .string()
      .regex(
        /^[1-9]{2}9[0-9]{8}$/,
        'Formato: DDD + 9 + 8 dígitos (Ex: 11912345678)',
      )
      .optional(),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Se não tiver nem email nem telefone
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe seu email ou telefone',
        path: ['email'],
      })
    }
    console.log('Schema validation data:', data)
  })

export const RegisterSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your full name',
    }),
    email: z.string().email({
      message: 'Please, provide a valid e-mail address.',
    }),
    phone: z
      .string()
      .regex(
        /^[1-9]{2}9[0-9]{8}$/,
        'Formato: DDD + 9 + 8 dígitos (Ex: 11912345678)',
      ),
    password: z.string().min(6, {
      message: 'Minimum 6 characters required',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match.',
    path: ['password_confirmation'],
  })

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
