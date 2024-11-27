import { z } from 'zod'

export const deliverySchema = z.object({
  __typename: z.literal('Delivery').default('Delivery'),
  id: z.string(),
  deliveryManId: z.string(),
})

export type Delivery = z.infer<typeof deliverySchema> 