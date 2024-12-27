'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Order } from '@/types/order'

import { SortableOrderCard } from './sortable-order-card'

interface OrderColumnProps {
  id: string
  title: string
  orders: Order[]
}

const columnColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  ready: 'bg-green-500/10 text-green-500',
  delivery: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-gray-500/10 text-gray-500',
}

export function OrderColumn({ id, title, orders }: OrderColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  // Pegar a cor baseada no ID da coluna (que deve corresponder ao status)
  const columnColor =
    columnColors[id as keyof typeof columnColors] || columnColors.pending

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${columnColor}`}
        >
          {orders.length}
        </span>
      </CardHeader>
      <CardContent ref={setNodeRef} className="space-y-4">
        <SortableContext items={orders} strategy={verticalListSortingStrategy}>
          {orders.map((order) => (
            <SortableOrderCard key={order.id} order={order} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  )
}
