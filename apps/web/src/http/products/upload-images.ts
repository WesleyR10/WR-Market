import { api } from '../api-client'

interface UploadProductImagesRequest {
  images: string[]
}

interface UploadProductImagesResponse {
  images: string[]
}

export async function uploadProductImages(
  org: string,
  id: string,
  data: UploadProductImagesRequest,
) {
  const response = await api
    .post(`organizations/${org}/products/${id}/images`, {
      json: data,
    })
    .json<UploadProductImagesResponse>()

  return response
}
