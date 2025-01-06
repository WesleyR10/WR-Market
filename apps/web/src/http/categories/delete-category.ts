import { api } from '../api-client'

export async function deleteCategory(org: string, categoryId: string) {
  await api.delete(`organizations/${org}/categories/${categoryId}`)
}
