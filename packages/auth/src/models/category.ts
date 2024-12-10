import { z } from 'zod'

export const categorySchema = z.object({
  __typename: z.literal('Category').default('Category'),
  id: z.string(),
  organizationId: z.string(),
  memberId: z.string(),
})

export type Category = z.infer<typeof categorySchema>
