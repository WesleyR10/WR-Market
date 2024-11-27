import { z } from 'zod'

export const supplierSchema = z.object({
  __typename: z.literal('Supplier').default('Supplier'),
  id: z.string(),
  createdById: z.string(),
})

export type Supplier = z.infer<typeof supplierSchema> 