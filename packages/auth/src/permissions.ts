import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from './index'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    // Admin só pode transferir propriedade da organização e atualizar se for dono
    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },

  GERENTE_GERAL(user, { can, cannot }) {
    can('manage', 'Product')
    can('manage', 'Category')
    can('manage', 'User')
    can('manage', 'Client')
    can('manage', 'Delivery')
    can('manage', 'Stock')
    can('manage', 'Sale') // Gerencia vendas para clientes
    can('manage', 'Purchase') // Gerencia compras
    can('manage', 'Supplier') // Gerencia fornecedores
    can(['get', 'export'], 'Report')

    // Gerente só pode deletar produtos/categorias se for responsável
    cannot('delete', ['Product', 'Category'])
    can('delete', ['Product', 'Category'], {
      memberId: { $eq: user.membership.id },
    })
  },

  GERENTE_VENDAS(user, { can }) {
    // Gerente de vendas só gerencia vendas (não tem acesso a compras)
    can('manage', 'Sale')
    can('manage', 'Client')
    can(['get', 'export'], 'Report')
    can('get', 'Product')
    can('get', 'Category')
    can('manage', 'User', {
      role: { $eq: 'VENDEDOR' },
    })
  },

  GERENTE_ESTOQUE(user, { can, cannot }) {
    can('manage', 'Stock')
    can('manage', 'Product')
    can('manage', 'Category')
    can(['get', 'export'], 'Report')
    can('manage', 'User', {
      role: { $eq: 'ESTOQUISTA' },
    })

    // Gerente de estoque gerencia compras e fornecedores (não tem acesso a vendas)
    can('manage', 'Purchase') // Controle total sobre compras
    can('manage', 'Supplier') // Gerencia fornecedores

    // Gerente só pode deletar produtos/categorias se for responsável
    cannot('delete', ['Product', 'Category'])
    can('delete', ['Product', 'Category'], {
      memberId: { $eq: user.membership.id },
    })
  },

  VENDEDOR(user, { can, cannot }) {
    can(['get', 'create'], 'Sale')
    can('get', 'Product')
    can('get', 'Category')
    can(['get', 'create', 'update'], 'Client')

    // Vendedor só pode atualizar vendas que ele criou
    cannot('update', 'Sale')
    can('update', 'Sale', {
      createdById: { $eq: user.id },
    })
  },

  ESTOQUISTA(user, { can }) {
    can(['get', 'update'], 'Product')
    can('get', 'Category')
    can('manage', 'Stock')

    // Estoquista pode ver e criar pedidos de compra (mas não pode aprovar)
    can(['get', 'create'], 'Purchase') // Cria requisições de compra
    can('delete', 'Purchase', {
      createdById: { $eq: user.id },
    }) // Deletar requisições que ele criou
    can('get', 'Supplier') // Pode ver fornecedores
  },

  ENTREGADOR(user, { can, cannot }) {
    can(['get', 'update'], 'Delivery')
    can('get', 'Client')

    // Entregador só pode atualizar entregas atribuídas a ele
    cannot('update', 'Delivery')
    can('update', 'Delivery', {
      deliveryManId: { $eq: user.id },
    })
  },
}
