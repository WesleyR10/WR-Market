import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import {
  DeliveryStatus,
  PrismaClient,
  PurchaseStatus,
  Role,
  SaleStatus,
} from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  // Limpar dados existentes mantendo a integridade referencial
  await prisma.auditLog.deleteMany()
  await prisma.delivery.deleteMany()
  await prisma.saleItem.deleteMany()
  await prisma.purchaseItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.address.deleteMany()
  await prisma.clientToken.deleteMany()
  await prisma.client.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.account.deleteMany()
  await prisma.token.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 6)
  const adminId = randomUUID()
  // Create all users with different roles
  const admin = await prisma.user.create({
    data: {
      id: adminId,
      name: 'Admin User',
      email: 'admin@wrmarket.com',
      avatarUrl: 'https://github.com/WesleyR10',
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
      name: 'Gerente de Vendas',
      email: 'gerente.vendas@wrmarket.com',
      phone: '11777777777',
      passwordHash,
      avatarUrl: faker.image.avatarGitHub(),
    },
  })

  const gerenteEstoque = await prisma.user.create({
    data: {
      name: 'Gerente de Estoque',
      email: 'gerente.estoque@wrmarket.com',
      phone: '11666666666',
      passwordHash,
      avatarUrl: faker.image.avatar(),
    },
  })

  const vendedor = await prisma.user.create({
    data: {
      name: 'Vendedor',
      email: 'vendedor@wrmarket.com',
      phone: '11555555555',
      passwordHash,
      avatarUrl: faker.image.avatarGitHub(),
    },
  })

  const estoquista = await prisma.user.create({
    data: {
      name: 'Estoquista',
      email: 'estoquista@wrmarket.com',
      phone: '11444444444',
      passwordHash,
      avatarUrl: faker.image.avatar(),
    },
  })

  const entregador = await prisma.user.create({
    data: {
      name: 'Entregador',
      email: 'entregador@wrmarket.com',
      phone: '11333333333',
      passwordHash,
      avatarUrl: faker.image.avatarGitHub(),
    },
  })

  // Criação da organização
  const organization = await prisma.organization.create({
    data: {
      name: 'WR Market',
      slug: 'wr-market',
      domain: 'wrmarket.com',
      shouldAttachUsersByDomain: true,
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: Role.ADMIN },
          { userId: gerenteGeral.id, role: Role.GERENTE_GERAL },
          { userId: gerenteVendas.id, role: Role.GERENTE_VENDAS },
          { userId: gerenteEstoque.id, role: Role.GERENTE_ESTOQUE },
          { userId: vendedor.id, role: Role.VENDEDOR },
          { userId: estoquista.id, role: Role.ESTOQUISTA },
          { userId: entregador.id, role: Role.ENTREGADOR },
        ],
      },
    },
  })

  const allMembers = await prisma.member.findMany()
  // Criação de categorias
  await prisma.category.createMany({
    data: [
      {
        name: 'Eletrônicos',
        description: 'Dispositivos eletrônicos',
        organizationId: organization.id,
        memberId: allMembers[0].id,
      },
      {
        name: 'Roupas',
        description: 'Vestuário masculino e feminino',
        organizationId: organization.id,
        memberId: allMembers[1].id,
      },
      {
        name: 'Alimentos',
        description: 'Produtos alimentícios',
        organizationId: organization.id,
        memberId: allMembers[2].id,
      },
      {
        name: 'Casa e Jardim',
        description: 'Itens para casa e jardim',
        organizationId: organization.id,
        memberId: allMembers[3].id,
      },
    ],
  })

  // Recuperar categorias criadas para relacionamentos
  const allCategories = await prisma.category.findMany({
    where: { organizationId: organization.id },
  })

  // Criação de produtos
  await prisma.product.createMany({
    data: Array.from({ length: 20 }).map(() => {
      const category = faker.helpers.arrayElement(allCategories)
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        organizationId: organization.id,
        categoryId: category.id,
        memberId: allMembers[0].id,
      }
    }),
  })

  const allProducts = await prisma.product.findMany({
    where: { organizationId: organization.id },
  })

  // Criação de estoques
  const stocksData = allProducts.map((product) => ({
    quantity: faker.number.int({ min: 50, max: 200 }),
    productId: product.id,
    organizationId: organization.id,
    memberId: allMembers[4].id,
  }))

  await prisma.stock.createMany({
    data: stocksData,
  })

  // Criação de fornecedores
  await prisma.supplier.createMany({
    data: [
      {
        name: 'Fornecedor A',
        email: 'fornecedor.a@wrmarket.com',
        phone: '11222222222',
        cnpj: '12345678000199',
        organizationId: organization.id,
        createdById: allMembers[1].id,
      },
      {
        name: 'Fornecedor B',
        email: 'fornecedor.b@wrmarket.com',
        phone: '11333333333',
        cnpj: '98765432000188',
        organizationId: organization.id,
        createdById: allMembers[1].id,
      },
      {
        name: 'Fornecedor C',
        email: 'fornecedor.c@wrmarket.com',
        phone: '11444444444',
        cnpj: '19283746000177',
        organizationId: organization.id,
        createdById: allMembers[1].id,
      },
    ],
  })

  // Recuperar fornecedores criados
  const allSuppliers = await prisma.supplier.findMany({
    where: { organizationId: organization.id },
  })

  // Criação de compras
  for (const supplier of allSuppliers) {
    const purchase = await prisma.purchase.create({
      data: {
        total: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
        status: faker.helpers.arrayElement(Object.values(PurchaseStatus)),
        supplierId: supplier.id,
        organizationId: organization.id,
        createdById: gerenteVendas.id,
      },
    })

    // Adicionar itens à compra
    const selectedProducts = faker.helpers.arrayElements(allProducts, 5)
    for (const product of selectedProducts) {
      await prisma.purchaseItem.create({
        data: {
          quantity: faker.number.int({ min: 10, max: 100 }),
          price: faker.commerce.price(),
          purchaseId: purchase.id,
          productId: product.id,
        },
      })
    }
  }

  // Criação de clientes
  await prisma.client.createMany({
    data: Array.from({ length: 10 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      cpf: faker.string.numeric(11),
      passwordHash,
      avatarUrl: faker.image.avatar(),
      birthDate: faker.date.birthdate({ min: 1960, max: 2000, mode: 'year' }),
    })),
  })

  const allClients = await prisma.client.findMany()

  // Criação de endereços para clientes
  for (const client of allClients) {
    await prisma.address.create({
      data: {
        street: faker.location.street(),
        number: faker.location.buildingNumber(),
        district: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        isMain: true,
        clientId: client.id,
      },
    })
  }

  // Criação de vendas
  for (const client of allClients) {
    const sale = await prisma.sale.create({
      data: {
        total: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
        status: faker.helpers.arrayElement(Object.values(SaleStatus)),
        source: 'ADMIN',
        clientId: client.id,
        organizationId: organization.id,
        createdById: vendedor.id,
      },
    })

    // Adicionar itens à venda
    const saleProducts = faker.helpers.arrayElements(allProducts, 3)
    for (const product of saleProducts) {
      await prisma.saleItem.create({
        data: {
          quantity: faker.number.int({ min: 1, max: 10 }),
          price: product.price,
          saleId: sale.id,
          productId: product.id,
        },
      })
    }

    // Criação de entrega para a venda
    await prisma.delivery.create({
      data: {
        status: faker.helpers.arrayElement(Object.values(DeliveryStatus)),
        saleId: sale.id,
        deliveryManId: entregador.id,
      },
    })
  }

  // Criação de logs de auditoria
  await prisma.auditLog.createMany({
    data: Array.from({ length: 20 }).map(() => ({
      memberId: allMembers[0].id,
      action: faker.lorem.words(),
      entity: 'Product',
      entityId: faker.database.mongodbObjectId(),
      changes: {
        field: faker.lorem.word(),
        old: faker.word.sample(),
        new: faker.word.sample(),
      },
    })),
  })

  console.log('Database seeded successfully!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
