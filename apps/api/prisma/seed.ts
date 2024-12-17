import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import {
  DeliveryStatus,
  PrismaClient,
  PurchaseStatus,
  Role,
  SaleStatus,
} from '@prisma/client'
import { InputJsonValue } from '@prisma/client/runtime/library'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function createAuditLog(
  memberId: string,
  action: string,
  entity: string,
  entityId: string,
  changes: Record<string, unknown>,
) {
  await prisma.auditLog.create({
    data: {
      memberId,
      action,
      entity,
      entityId,
      changes: changes as unknown as InputJsonValue,
      createdAt: new Date(),
    },
  })
}

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
      isTwoFactorEnabled: false,
      phone: '11999999999',
    },
  })

  const gerenteGeral = await prisma.user.create({
    data: {
      name: 'Gerente Geral',
      email: 'gerente.geral@wrmarket.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
      isTwoFactorEnabled: true,
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
        approvedById: gerenteGeral.id,
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
      isActive: true,
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

  // Log para criação de categorias
  for (const category of allCategories) {
    await createAuditLog(allMembers[0].id, 'CREATE', 'Category', category.id, {
      name: category.name,
      description: category.description,
      organizationId: category.organizationId,
    })
  }

  // Log para criação de produtos
  for (const product of allProducts) {
    await createAuditLog(allMembers[0].id, 'CREATE', 'Product', product.id, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    })
  }

  // Log para criação de estoques
  const allStocks = await prisma.stock.findMany()
  for (const stock of allStocks) {
    await createAuditLog(
      allMembers[4].id, // estoquista
      'CREATE',
      'Stock',
      stock.id,
      {
        quantity: stock.quantity,
        productId: stock.productId,
      },
    )
  }

  // Log para criação de compras
  const allPurchases = await prisma.purchase.findMany()
  for (const purchase of allPurchases) {
    await createAuditLog(
      allMembers[2].id, // gerente de vendas
      'CREATE',
      'Purchase',
      purchase.id,
      {
        total: purchase.total,
        status: purchase.status,
        supplierId: purchase.supplierId,
      },
    )
  }

  // Log para criação de vendas
  const allSales = await prisma.sale.findMany()
  for (const sale of allSales) {
    await createAuditLog(
      allMembers[4].id, // vendedor
      'CREATE',
      'Sale',
      sale.id,
      {
        total: sale.total,
        status: sale.status,
        clientId: sale.clientId,
        source: sale.source,
      },
    )
  }

  // Log para criação de entregas
  const allDeliveries = await prisma.delivery.findMany()
  for (const delivery of allDeliveries) {
    await createAuditLog(
      allMembers[6].id, // entregador
      'CREATE',
      'Delivery',
      delivery.id,
      {
        status: delivery.status,
        saleId: delivery.saleId,
      },
    )
  }

  // Log para criação de fornecedores
  for (const supplier of allSuppliers) {
    await createAuditLog(
      allMembers[2].id, // gerente de vendas
      'CREATE',
      'Supplier',
      supplier.id,
      {
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        cnpj: supplier.cnpj,
      },
    )
  }

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
