import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import sharp from 'sharp'
import { z } from 'zod'

import { ProductImageUploadNotAllowedError } from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { R2StorageService } from '@/services/r2-storage'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function uploadProductImages(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/products/images/upload',
      {
        schema: {
          tags: ['Products'],
          summary: 'Upload product images',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              images: z.array(z.string()),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Product')) {
          throw new ProductImageUploadNotAllowedError()
        }

        const files = await request.parts()
        const uploadedImageUrls: string[] = []

        for await (const part of files) {
          if (part.type === 'file') {
            const buffer = await part.toBuffer()

            // Otimização no servidor usando sharp
            const optimizedBuffer = await sharp(buffer)
              .resize(1920, 1080, {
                fit: 'inside',
                withoutEnlargement: true,
              })
              .toBuffer()

            const contentType = part.mimetype

            const imageUrl = await R2StorageService.uploadImage(
              optimizedBuffer,
              organization.slug,
              part.filename,
              contentType,
            )

            if (imageUrl) {
              uploadedImageUrls.push(imageUrl)
            }
          }
        }

        return reply.send({ images: uploadedImageUrls })
      },
    )
}
