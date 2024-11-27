import { z } from 'zod'

export const reportSchema = z.object({
  __typename: z.literal('Report').default('Report'),
  id: z.string(),
})

export type Report = z.infer<typeof reportSchema> 