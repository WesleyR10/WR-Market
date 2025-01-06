import { ProductFormData } from '@/schemas/product'

import { api } from '../api-client'

interface CreateProductResponse {
  id: string
}

export async function createProduct(org: string, data: ProductFormData) {
  const response = await api
    .post(`organizations/${org}/products`, {
      json: {
        ...data,
        images: data.images || [], // Garante que sempre será um array
      },
    })
    .json<CreateProductResponse>()

  return response
}
