import { z } from 'zod'

import { deliverySchema } from '../models/delivery'

export const deliverySubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Delivery'), deliverySchema]),
])

export type DeliverySubject = z.infer<typeof deliverySubject>
