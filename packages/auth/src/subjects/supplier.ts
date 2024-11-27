import { z } from 'zod'
import { supplierSchema } from '../models/supplier'

export const supplierSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Supplier'), supplierSchema]),
]) 