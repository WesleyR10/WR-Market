'use client'

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'

import { type Order } from '@/types/order'

import { OrderCard } from './order-card'
import { OrderColumn } from './order-column'

interface OrdersBoardProps {
  initialOrders: Order[]
}

type Column = {
  id: string
  title: string
  orders: Order[]
}

const initialColumns: Column[] = [
  { id: 'pending', title: 'Novos Pedidos', orders: [] },
  { id: 'processing', title: 'Em Preparo', orders: [] },
  { id: 'ready', title: 'Pronto para Entrega', orders: [] },
  { id: 'delivery', title: 'Em Rota', orders: [] },
  { id: 'completed', title: 'Entregue', orders: [] },
]

export function OrdersBoard({ initialOrders }: OrdersBoardProps) {
  const [columns, setColumns] = useState<Column[]>(() =>
    initialColumns.map((column) => ({
      ...column,
      orders: initialOrders.filter((order) => order.status === column.id),
    })),
  )
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const activeOrder = columns
      .flatMap((col) => col.orders)
      .find((order) => order.id === active.id)

    setActiveOrder(activeOrder ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const activeOrderId = active.id
    const overColumnId = over.id

    const activeColumn = columns.find((col) =>
      col.orders.some((order) => order.id === activeOrderId),
    )
    const overColumn = columns.find((col) => col.id === overColumnId)

    if (!activeColumn || !overColumn) return

    const order = activeColumn.orders.find(
      (order) => order.id === activeOrderId,
    )
    if (!order) return

    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        // Remove from source column
        if (column.id === activeColumn.id) {
          return {
            ...column,
            orders: column.orders.filter((order) => order.id !== activeOrderId),
          }
        }
        // Add to target column
        if (column.id === overColumn.id) {
          return {
            ...column,
            orders: [
              ...column.orders,
              { ...order, status: column.id as Order['status'] },
            ],
          }
        }
        return column
      })
    })

    setActiveOrder(null)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => (
          <OrderColumn
            key={column.id}
            id={column.id}
            title={column.title}
            orders={column.orders}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOrder ? (
          <div className="rotate-3 opacity-90">
            <OrderCard order={activeOrder} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
