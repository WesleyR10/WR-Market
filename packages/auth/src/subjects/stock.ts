import { z } from 'zod'
import { stockSchema } from '../models/stock'

export const stockSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Stock'), stockSchema]),
])

export type StockSubject = z.infer<typeof stockSubject> 