import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('GERENTE_GERAL'),
  z.literal('GERENTE_VENDAS'),
  z.literal('GERENTE_ESTOQUE'),
  z.literal('VENDEDOR'),
  z.literal('ESTOQUISTA'),
  z.literal('ENTREGADOR'),
])

export type Role = z.infer<typeof roleSchema>
