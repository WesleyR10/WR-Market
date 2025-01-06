import { api } from '../api-client'

interface GetCategoryResponse {
  category: {
    id: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export async function getCategory(org: string, categoryId: string) {
  const response = await api
    .get(`organizations/${org}/categories/${categoryId}`)
    .json<GetCategoryResponse>()

  return response
}
