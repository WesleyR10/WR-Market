import { api } from '../api-client'

export async function deleteProduct(org: string, id: string) {
  await api.delete(`organizations/${org}/products/${id}`)
}
