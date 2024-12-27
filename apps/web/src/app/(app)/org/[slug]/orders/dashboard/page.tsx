'use client'

import { useOrders } from '@/hooks/use-orders'

import { OrdersBoard } from './components/orders-board'
import { OrdersHeader } from './components/orders-header'

export default function OrdersDashboardPage() {
  const { orders, isLoading } = useOrders()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex h-full flex-col px-4">
      <OrdersHeader />
      <OrdersBoard initialOrders={orders} />
    </div>
  )
}
