import { api } from '../api-client'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  isActive: boolean
  categoryId: string
  category: {
    id: string
    name: string
  }
}

interface GetProductResponse {
  product: Product
}

export async function getProduct(id: string) {
  const response = await api.get(`products/${id}`).json<GetProductResponse>()

  return response
}
