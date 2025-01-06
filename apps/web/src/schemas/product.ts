import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço deve ser maior que zero'),
  costPrice: z.coerce.number().optional(),
  categoryId: z.string().uuid('Categoria inválida'),
  images: z.array(z.string()).default([]),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  weight: z.coerce.number().optional(),
  unit: z.enum(['un', 'kg', 'g', 'l', 'ml']),
  minStock: z.coerce.number().int().optional(),
  maxStock: z.coerce.number().int().optional(),
  stockQuantity: z.coerce
    .number()
    .int()
    .min(0, 'Quantidade não pode ser negativa'),
  isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>
