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

import { errorHandler } from '@/http/error-handler'
import {
  createAccount,
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
      }
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

app.register(createAccount)


app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
