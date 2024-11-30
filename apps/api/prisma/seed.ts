import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  // Clean up existing data
  await prisma.delivery.deleteMany()
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.purchaseItem.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.client.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.member.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 6)

  // Create all users with different roles
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const gerenteGeral = await prisma.user.create({
    data: {
      name: 'Gerente Geral',
      email: 'gerente.geral@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const gerenteVendas = await prisma.user.create({
    data: {
      name: 'Gerente Vendas',
      email: 'gerente.vendas@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const gerenteEstoque = await prisma.user.create({
    data: {
      name: 'Gerente Estoque',
      email: 'gerente.estoque@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const vendedor = await prisma.user.create({
    data: {
      name: 'Vendedor',
      email: 'vendedor@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const estoquista = await prisma.user.create({
    data: {
      name: 'Estoquista',
      email: 'estoquista@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const entregador = await prisma.user.create({
    data: {
      name: 'Entregador',
      email: 'entregador@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // Create categories (4 categories)
  const categories = await Promise.all(
    Array(4).fill(0).map(async () => {
      return prisma.category.create({
        data: {
          name: faker.commerce.department(),
          ownerId: gerenteEstoque.id,
        },
      })
    })
  )

  // Create 4 products per category
  const products = await Promise.all(
    categories.flatMap((category) =>
      Array(4).fill(0).map(async () => {
        return prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            ownerId: gerenteEstoque.id,
            categoryId: category.id,
          },
        })
      })
    )
  )

  // Create stock entries for all products
  await Promise.all(
    products.map((product) =>
      prisma.stock.create({
        data: {
          productId: product.id,
          quantity: faker.number.int({ min: 10, max: 100 }),
        },
      })
    )
  )

  // Create suppliers with purchases
  const suppliers = await Promise.all(
    Array(3).fill(0).map(async () => {
      const supplier = await prisma.supplier.create({
        data: {
          name: faker.company.name(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          cnpj: faker.string.numeric(14),
        },
      })

      // Create purchases for each supplier
      await Promise.all(
        Array(2).fill(0).map(async () => {
          const selectedProducts = faker.helpers.arrayElements(products, 3)
          const purchaseItems = selectedProducts.map((product) => ({
            productId: product.id,
            quantity: faker.number.int({ min: 5, max: 20 }),
            price: parseFloat(faker.commerce.price()),
          }))

          const total = purchaseItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          )

          return prisma.purchase.create({
            data: {
              supplierId: supplier.id,
              createdById: estoquista.id,
              approvedById: gerenteEstoque.id,
              status: faker.helpers.arrayElement(['PENDING', 'APPROVED', 'RECEIVED']),
              total,
              items: {
                create: purchaseItems,
              },
            },
          })
        })
      )

      return supplier
    })
  )

  // Create clients with sales and deliveries
  const clients = await Promise.all(
    Array(5).fill(0).map(async () => {
      return prisma.client.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          cpf: faker.string.numeric(11),
          addresses: {
            create: {
              street: faker.location.street(),
              number: faker.string.numeric(3),
              district: faker.location.county(),
              city: faker.location.city(),
              state: faker.location.state(),
              zipCode: faker.location.zipCode(),
              isMain: false,
            },
          },
        },
      })
    })
  )

  // Create sales with items and deliveries
  await Promise.all(
    clients.map(async (client) => {
      const selectedProducts = faker.helpers.arrayElements(products, 3)
      const saleItems = selectedProducts.map((product) => ({
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: parseFloat(faker.commerce.price()),
      }))

      const total = saleItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      )

      return prisma.sale.create({
        data: {
          clientId: client.id,
          createdById: vendedor.id,
          status: faker.helpers.arrayElement(['PENDING', 'PAID', 'CANCELLED']),
          total,
          items: {
            create: saleItems,
          },
          delivery: {
            create: {
              status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'DELIVERED']),
              deliveryManId: entregador.id,
            },
          },
        },
      })
    })
  )

  // Create organization with all members
  await prisma.organization.create({
    data: {
      name: 'WR Market',
      slug: 'wr-market',
      domain: 'wrmarket.com',
      shouldAttachUsersByDomain: true,
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: admin.id,
      members: {
        createMany: {
          data: [
            { userId: admin.id, role: 'ADMIN' },
            { userId: gerenteGeral.id, role: 'GERENTE_GERAL' },
            { userId: gerenteVendas.id, role: 'GERENTE_VENDAS' },
            { userId: gerenteEstoque.id, role: 'GERENTE_ESTOQUE' },
            { userId: vendedor.id, role: 'VENDEDOR' },
            { userId: estoquista.id, role: 'ESTOQUISTA' },
            { userId: entregador.id, role: 'ENTREGADOR' },
          ],
        },
      },
    },
  })
}

seed()
  .then(async () => {
    console.log('Database seeded successfully!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
