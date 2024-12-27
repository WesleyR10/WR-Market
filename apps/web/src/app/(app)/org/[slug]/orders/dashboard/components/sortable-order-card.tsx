'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { type Order } from '@/types/order'

import { OrderCard } from './order-card'

interface SortableOrderCardProps {
  order: Order
}

export function SortableOrderCard({ order }: SortableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: order.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderCard order={order} />
    </div>
  )
}
