import { z } from 'zod'

import { reportSchema } from '../models/report'

export const reportSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('export')]),
  z.union([z.literal('Report'), reportSchema]),
])

export type ReportSubject = z.infer<typeof reportSubject>
