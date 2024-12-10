import { z } from 'zod'

import { purchaseSchema } from '../models/purchase'

export const purchaseSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('approve'),
    z.literal('reject'),
  ]),
  z.union([z.literal('Purchase'), purchaseSchema]),
])
