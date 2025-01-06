import 'dotenv/config'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@wr-market/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from '@/http/middlewares/error-handler'
import {
  authenticateClient,
  authenticateWithGoogle,
  authenticateWithPassword,
  createAccount,
  createCategory,
  createClientAccount,
  createClientAddress,
  createOrganization,
  createProduct,
  createPurchase,
  createSale,
  createStock,
  createSupplier,
  deleteCategory,
  deleteClientAddress,
  deleteProduct,
  deleteProductImages,
  deletePurchase,
  deleteSale,
  deleteStock,
  deleteSupplier,
  getCategory,
  getClientProfile,
  getMembers,
  getMembership,
  getOrganization,
  getOrganizations,
  getProduct,
  getProfile,
  getPurchase,
  getSale,
  getStock,
  getSupplier,
  listCategories,
  listClientAddresses,
  listProducts,
  listPurchases,
  listSales,
  listStocks,
  listSuppliers,
  removeMember,
  removeMembers,
  requestClientPasswordRecover,
  requestPasswordRecover,
  resetClientPassword,
  resetPassword,
  setMainClientAddress,
  shutdownOrganization,
  transferOrganization,
  twoFactorRoutes,
  updateCategory,
  updateClientAddress,
  updateClientProfile,
  updateMember,
  updateOrganization,
  updateProduct,
  updateProfile,
  updatePurchase,
  updateSale,
  updateStock,
  updateSupplier,
  uploadProductImages,
} from '@/http/routes'

const app = fastify({
  // Aumenta o limite para 50MB
  bodyLimit: 52428800, // 50 * 1024 * 1024
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'WR Market API',
      description: `
        API do sistema WR Market - Sistema completo para gestão de mercados e varejos.

        Visão Geral
        Sistema desenvolvido para atender múltiplas filiais com controle completo de estoque, 
        vendas, compras e entregas.
            
        Recursos Principais
        ✓ Gestão de múltiplas organizações/filiais
        ✓ Controle de estoque e produtos
        ✓ Gestão de vendas e compras
        ✓ Sistema de entregas
        ✓ Gestão de clientes e fornecedores
        ✓ Controle de acesso baseado em papéis (RBAC)
        ✓ Relatórios e análises
            
        Autenticação
        Todas as rotas (exceto /auth) requerem autenticação via JWT Bearer Token.
      `,
      contact: {
        name: 'Suporte WR Market',
        email: 'wesleyribas2015@gmail.com',
      },
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticação e autorização',
        externalDocs: {
          description: 'Roles e Permissões',
          url: '/docs/roles',
        },
      },
      {
        name: 'Organizations',
        description: 'Gestão de organizações/filiais',
      },
      {
        name: 'Members',
        description: 'Gestão de membros da organização',
      },
      {
        name: 'Client',
        description: 'Área do cliente - cadastro e gerenciamento de conta',
      },
      {
        name: 'Client Addresses',
        description: 'Gerenciamento de endereços do cliente',
      },
      {
        name: 'Categories',
        description: 'Gestão de categorias',
      },
      {
        name: 'Products',
        description: 'Gestão de produtos e categorias',
      },
      {
        name: 'Sales',
        description: 'Gestão de vendas e clientes',
      },
      {
        name: 'Purchases',
        description: 'Gestão de compras e fornecedores',
      },
      {
        name: 'Stock',
        description: 'Controle de estoque',
      },
      {
        name: 'Suppliers',
        description: 'Gestão de fornecedores',
      },
      {
        name: 'Deliveries',
        description: 'Sistema de entregas e rastreamento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Role: {
          type: 'string',
          enum: [
            'ADMIN',
            'GERENTE_GERAL',
            'GERENTE_VENDAS',
            'GERENTE_ESTOQUE',
            'VENDEDOR',
            'ESTOQUISTA',
            'ENTREGADOR',
          ],
          description: 'Papéis disponíveis no sistema',
        },
        Error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' },
          },
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10, // máximo de 10 arquivos por vez
  },
})

// Auth
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(resetPassword)
app.register(twoFactorRoutes)
app.register(updateProfile)
app.register(authenticateWithGoogle)

// Organizations
app.register(createOrganization)
app.register(updateOrganization)
app.register(getOrganizations)
app.register(getOrganization)
app.register(getMembership)
app.register(shutdownOrganization)
app.register(transferOrganization)

// Members
app.register(getMembers)
app.register(updateMember)
app.register(removeMember)
app.register(removeMembers)

// Client
app.register(resetClientPassword)
app.register(requestPasswordRecover)
app.register(requestClientPasswordRecover)
app.register(authenticateClient)
app.register(createClientAccount)
app.register(getClientProfile)
app.register(updateClientProfile)

// Client Addresses
app.register(createClientAddress)
app.register(updateClientAddress)
app.register(deleteClientAddress)
app.register(listClientAddresses)
app.register(setMainClientAddress)

// Categories
app.register(createCategory)
app.register(updateCategory)
app.register(deleteCategory)
app.register(getCategory)
app.register(listCategories)

// Products
app.register(createProduct)
app.register(updateProduct)
app.register(deleteProduct)
app.register(getProduct)
app.register(listProducts)
app.register(uploadProductImages)
app.register(deleteProductImages)

// Suppliers
app.register(createSupplier)
app.register(updateSupplier)
app.register(deleteSupplier)
app.register(getSupplier)
app.register(listSuppliers)

// Sales
app.register(createSale)
app.register(updateSale)
app.register(deleteSale)
app.register(getSale)
app.register(listSales)

// Stock
app.register(createStock)
app.register(updateStock)
app.register(deleteStock)
app.register(getStock)
app.register(listStocks)

// Purchases
app.register(createPurchase)
app.register(updatePurchase)
app.register(deletePurchase)
app.register(getPurchase)
app.register(listPurchases)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
