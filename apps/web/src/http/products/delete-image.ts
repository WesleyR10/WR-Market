import { api } from '../api-client'

interface DeleteProductImagesRequest {
  imageUrls: string[]
}

export async function deleteProductImages(
  org: string,
  data: DeleteProductImagesRequest,
) {
  await api.delete(`organizations/${org}/images`, {
    json: data,
  })
}
