import { api } from '../api-client'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  isActive: boolean
  categoryId: string
}

interface ListProductsResponse {
  products: Product[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

interface ListProductsParams {
  page?: number
  perPage?: number
  search?: string
  categoryId?: string
}

export async function listProducts(org: string, params?: ListProductsParams) {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.perPage) searchParams.set('perPage', params.perPage.toString())
  if (params?.search) searchParams.set('search', params.search)
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)

  const response = await api
    .get(`organizations/${org}/products?${searchParams}`)
    .json<ListProductsResponse>()

  return response
}
