import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { CategoryNotBelongsToOrganizationError } from '@/errors/domain/category-errors'
import { ProductCreateNotAllowedError } from '@/errors/domain/product-errors'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { dateUtils } from '@/utils/date'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['Products'],
          summary: 'Create a new product',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            categoryId: z.string().uuid(),
            sku: z.string().optional(),
            barcode: z.string().optional(),
            brand: z.string().optional(),
            unit: z.string().optional(),
            weight: z.number().optional(),
            costPrice: z.number().optional(),
            minStock: z.number().optional(),
            maxStock: z.number().optional(),
            images: z.array(z.string().url()),
            name: z.string(),
            description: z.string(),
            price: z.number().positive(),
            isActive: z.boolean().default(true),
            stockQuantity: z
              .number()
              .int()
              .min(0, 'Quantidade não pode ser negativa'),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { categoryId } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const category = await prisma.category.findFirst({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        if (!category) {
          throw new CategoryNotBelongsToOrganizationError()
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Product')) {
          throw new ProductCreateNotAllowedError()
        }

        // Usar transação para garantir atomicidade
        const result = await prisma.$transaction(async (tx) => {
          const product = await tx.product.create({
            data: {
              name: request.body.name,
              description: request.body.description,
              price: request.body.price,
              costPrice: request.body.costPrice,
              categoryId: request.body.categoryId,
              images: request.body.images, // URLs já existentes no R2
              sku: request.body.sku,
              barcode: request.body.barcode,
              brand: request.body.brand,
              weight: request.body.weight,
              unit: request.body.unit,
              minStock: request.body.minStock,
              maxStock: request.body.maxStock,
              isActive: request.body.isActive,
              createdById: membership.id,
              organizationId: organization.id,
            },
          })

          // Criar o log de auditoria
          await tx.auditLog.create({
            data: {
              memberId: membership.id,
              action: 'CREATE',
              entity: 'Product',
              entityId: product.id,
              changes: {
                old: null,
                new: product,
              },
              createdAt: dateUtils.toDate(new Date()),
            },
          })

          // Se houver quantidade de estoque, criar o registro de estoque
          if (request.body.stockQuantity > 0) {
            await tx.stock.create({
              data: {
                quantity: request.body.stockQuantity,
                productId: product.id,
                organizationId: organization.id,
                createdById: membership.id,
              },
            })
          }

          return product
        })

        return reply.status(201).send({ id: result.id })
      },
    )
}
