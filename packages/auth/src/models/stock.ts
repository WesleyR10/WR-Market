import { z } from 'zod'

export const stockSchema = z.object({
  __typename: z.literal('Stock').default('Stock'),
  id: z.string(),
})

export type Stock = z.infer<typeof stockSchema>
