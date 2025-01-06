import { api } from '../api-client'

interface CreateCategoryRequest {
  name: string
  description?: string
}

interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory(org: string, data: CreateCategoryRequest) {
  const response = await api
    .post(`organizations/${org}/categories`, {
      json: data,
    })
    .json<CreateCategoryResponse>()

  return response
}
