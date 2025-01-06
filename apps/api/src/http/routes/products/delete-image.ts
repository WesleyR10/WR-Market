import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { ProductImageDeleteNotAllowedError } from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { R2StorageService } from '@/services/r2-storage'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteProductImages(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/images',
      {
        schema: {
          tags: ['Products'],
          summary: 'Delete product images',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            imageUrls: z.array(z.string().url()),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { imageUrls } = request.body
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Product')) {
          throw new ProductImageDeleteNotAllowedError()
        }

        // Deletar as imagens do R2 diretamente
        await Promise.all(
          imageUrls.map((imageUrl) => R2StorageService.deleteImage(imageUrl)),
        )

        return reply.status(204).send()
      },
    )
}
