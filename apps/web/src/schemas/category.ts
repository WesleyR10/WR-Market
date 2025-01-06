import { z } from 'zod'

export const CategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
}) as z.ZodType<{
  name: string
  description?: string
}>

export type CategoryFormValues = z.infer<typeof CategorySchema>
