import 'dotenv/config'
import fastifyCors from '@fastify/cors'
import { env } from '@wr-market/env'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from '@/http/middlewares/error-handler'
import {
  authenticateWithPassword,
  createAccount,
  getProfile,
  requestPasswordRecover,
  resetPassword,
  authenticateClient, 
  createClientAccount,
  getClientProfile,
  requestClientPasswordRecover,
  resetClientPassword,
  updateClientProfile,
  createClientAddress,
  updateClientAddress,
  deleteClientAddress,
  listClientAddresses,
  setMainClientAddress,
  createOrganization,
  updateOrganization,
  getMembership,
  getOrganization,
  getOrganizations,
  shutdownOrganization,
  transferOrganization,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  listProducts,
  listSuppliers,
  getSupplier,
  updateSupplier,
  createSupplier,
  deleteSupplier,
} from '@/http/routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

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
          url: '/docs/roles'
        }
      },
      { 
        name: 'Organizations', 
        description: 'Gestão de organizações/filiais',
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
        name: 'Inventory', 
        description: 'Controle de estoque',
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
          enum: ['ADMIN', 'GERENTE_GERAL', 'GERENTE_VENDAS', 'GERENTE_ESTOQUE', 'VENDEDOR', 'ESTOQUISTA', 'ENTREGADOR'],
          description: 'Papéis disponíveis no sistema'
        },
        Error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
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

app.register(fastifyCors)

// Auth
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(resetPassword)

// Organizations
app.register(createOrganization)
app.register(updateOrganization)
app.register(getOrganizations)
app.register(getOrganization)
app.register(getMembership)
app.register(shutdownOrganization)
app.register(transferOrganization)

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

// Suppliers
app.register(createSupplier)
app.register(updateSupplier)
app.register(deleteSupplier)
app.register(getSupplier)
app.register(listSuppliers)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
