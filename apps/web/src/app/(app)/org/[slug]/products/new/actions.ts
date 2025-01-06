'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { createCategory, getCategories } from '@/http/categories'
import { createProduct, deleteProductImages } from '@/http/products'
import { ProductFormData } from '@/schemas/product'

export async function getCategoriesData(slug: string) {
  if (!slug) {
    return []
  }

  try {
    const { categories } = await getCategories(slug)
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createCategoryAction(
  org: string,
  data: { name: string; description?: string },
) {
  try {
    await createCategory(org, data)
    revalidatePath(`/org/${org}/products/new`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao criar categoria' }
  }
}

export async function createProductAction(org: string, data: ProductFormData) {
  try {
    const response = await createProduct(org, data)

    revalidatePath(`/org/${org}/products`)
    return { success: true, data: response }
  } catch (error) {
    console.error('createProductAction - Erro:', error)
    return { success: false, error: 'Falha ao criar produto' }
  }
}

export async function uploadProductImagesAction(
  org: string,
  files: File[],
): Promise<{ success: boolean; images?: string[]; error?: string }> {
  try {
    const formData = new FormData()

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        console.warn(
          'Arquivo ignorado:',
          file.name,
          '- tipo não suportado:',
          file.type,
        )
        continue
      }
      formData.append('images', file)
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/organizations/${org}/products/images/upload`

    const token = cookies().get('token')?.value

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })

      if (response.status === 403) {
        throw new Error('Você não tem permissão para fazer upload de imagens')
      }

      throw new Error(errorData.message || 'Erro ao fazer upload das imagens')
    }

    const data = await response.json()
    return { success: true, images: data.images }
  } catch (error) {
    console.error('uploadProductImagesAction - Erro detalhado:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Falha ao fazer upload das imagens',
    }
  }
}

export async function deleteProductImageAction(
  org: string,
  imageUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteProductImages(org, {
      imageUrls: [imageUrl],
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar imagem:', {
      error,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: (error as any).response?.data,
    })
    return {
      success: false,
      error:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message || 'Falha ao deletar imagem',
    }
  }
}
