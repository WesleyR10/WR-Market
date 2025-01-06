import { api } from '../api-client'

interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface GetCategoriesResponse {
  categories: Category[]
}

export async function getCategories(org: string) {
  const response = await api
    .get(`organizations/${org}/categories`)
    .json<GetCategoriesResponse>()

  return response
}
