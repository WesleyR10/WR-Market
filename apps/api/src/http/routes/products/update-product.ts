import { Prisma } from '@prisma/client'
import { productSchema } from '@wr-market/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  ProductNotFoundError,
  ProductUpdateNotAllowedError,
} from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { R2StorageService } from '@/services/r2-storage'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/products/:id',
      {
        schema: {
          tags: ['Products'],
          summary: 'Update product details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().positive().optional(),
            categoryId: z.string().uuid().optional(),
            images: z.array(z.string()).optional(),
            isActive: z.boolean().optional(),
            imagesToDelete: z.array(z.string()).optional(),
          }),
          response: {
            204: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params
        const {
          name,
          description,
          price,
          categoryId,
          images,
          isActive,
          imagesToDelete,
        } = request.body
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const product = await prisma.product.findUnique({
          where: {
            id,
            organizationId: membership.organizationId,
          },
        })

        if (!product) {
          throw new ProductNotFoundError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        const authProduct = productSchema.parse(product)

        if (cannot('update', authProduct)) {
          throw new ProductUpdateNotAllowedError()
        }

        const uploadedImageUrls: string[] = []

        // Upload de novas imagens
        if (images && images.length > 0) {
          for (const image of images) {
            const imageUrl = await R2StorageService.uploadImage(
              image,
              organization.slug,
              product.name,
            )
            if (imageUrl) {
              uploadedImageUrls.push(imageUrl)
            }
          }
        }

        // Deletar imagens
        if (imagesToDelete && imagesToDelete.length > 0) {
          await Promise.all(
            imagesToDelete.map((imageUrl) =>
              R2StorageService.deleteImage(imageUrl),
            ),
          )
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          const updated = await tx.product.update({
            where: {
              id,
              organizationId: membership.organizationId,
            },
            data: {
              name,
              description,
              price,
              categoryId,
              isActive,
              images: images
                ? [...(product?.images || []), ...uploadedImageUrls]
                : undefined,
            },
          })

          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'UPDATE',
              entity: 'Product',
              entityId: id,
              changes: {
                old: product,
                new: updated,
              },
              createdAt: new Date(),
            },
          })
        })

        return reply
          .status(204)
          .send({ message: 'Produto atualizado com sucesso' })
      },
    )
}
