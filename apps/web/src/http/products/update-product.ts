import { api } from '../api-client'

interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  categoryId?: string
  images?: string[]
  isActive?: boolean
  imagesToDelete?: string[]
}

interface UpdateProductResponse {
  message: string
}

export async function updateProduct(
  org: string,
  id: string,
  data: UpdateProductRequest,
) {
  const response = await api
    .put(`organizations/${org}/products/${id}`, {
      json: data,
    })
    .json<UpdateProductResponse>()

  return response
}
