import { z } from 'zod'

export const purchaseSchema = z.object({
  __typename: z.literal('Purchase').default('Purchase'),
  id: z.string(),
  createdById: z.string(),
  supplierId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})

export type Purchase = z.infer<typeof purchaseSchema> 