import { z } from 'zod'

export const saleSchema = z.object({
  __typename: z.literal('Sale').default('Sale'),
  id: z.string(),
  createdById: z.string(),
})

export type Sale = z.infer<typeof saleSchema>
