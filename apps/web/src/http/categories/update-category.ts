import { api } from '../api-client'

interface UpdateCategoryRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export async function updateCategory(
  org: string,
  categoryId: string,
  data: UpdateCategoryRequest,
) {
  await api.put(`organizations/${org}/categories/${categoryId}`, {
    json: data,
  })
}
