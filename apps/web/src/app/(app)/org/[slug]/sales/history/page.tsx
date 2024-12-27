'use client'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'

const mockOrders = [
  {
    id: '1',
    orderNumber: '001',
    customer: 'João Silva',
    status: 'pending' as const,
    total: 299.99,
    items: 3,
    createdAt: '2024-03-10T10:00:00',
    paymentMethod: 'credit_card',
  },
  {
    id: '2',
    orderNumber: '002',
    customer: 'Maria Santos',
    status: 'completed' as const,
    total: 159.99,
    items: 2,
    createdAt: '2024-03-09T15:30:00',
    paymentMethod: 'pix',
  },
  {
    id: '3',
    orderNumber: '003',
    customer: 'Pedro Oliveira',
    status: 'processing' as const,
    total: 459.99,
    items: 5,
    createdAt: '2024-03-08T09:15:00',
    paymentMethod: 'credit_card',
  },
  {
    id: '4',
    orderNumber: '004',
    customer: 'Ana Costa',
    status: 'cancelled' as const,
    total: 89.99,
    items: 1,
    createdAt: '2024-03-07T14:20:00',
    paymentMethod: 'pix',
  },
  // Adicione mais pedidos mockados aqui...
]

export default function OrdersPage() {
  return (
    <div className="px-4">
      <div className="mb-6">
        <h1 className="mb-1 text-3xl font-bold">Histórico de Vendas</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe todos os pedidos em um único lugar
        </p>
      </div>

      <DataTable columns={columns} data={mockOrders} />
    </div>
  )
}
