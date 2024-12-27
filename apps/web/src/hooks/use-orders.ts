'use client'

import { useEffect, useState } from 'react'

import { type Order } from '@/types/order'

// Dados fictícios para teste
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'PED-001',
    customer: 'João Silva',
    status: 'pending',
    total: 149.9,
    paymentMethod: 'credit_card',
    items: [
      {
        id: '1',
        name: 'Pizza Grande Margherita',
        quantity: 1,
        price: 89.9,
        image:
          'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '2',
        name: 'Refrigerante Cola 2L',
        quantity: 2,
        price: 30.0,
        image:
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '3',
        name: 'Suco Natural Laranja',
        quantity: 2,
        price: 29.9,
        image:
          'https://images.unsplash.com/photo-1650460069032-3c410224fe55?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
    observation: 'Sem cebola por favor',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: 'PED-002',
    customer: 'Maria Santos',
    status: 'processing',
    total: 97.8,
    paymentMethod: 'pix',
    items: [
      {
        id: '3',
        name: 'Pizza Média Calabresa',
        quantity: 1,
        price: 67.9,
        image:
          'https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '4',
        name: 'Suco Natural Laranja',
        quantity: 2,
        price: 29.9,
        image:
          'https://images.unsplash.com/photo-1650460069032-3c410224fe55?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    orderNumber: 'PED-003',
    customer: 'Pedro Oliveira',
    status: 'ready',
    total: 135.7,
    paymentMethod: 'debit_card',
    items: [
      {
        id: '5',
        name: 'Pizza Família Portuguesa',
        quantity: 1,
        price: 99.9,
        image:
          'https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '6',
        name: 'Cerveja Pilsen 600ml',
        quantity: 3,
        price: 35.8,
        image:
          'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
    observation: 'Entregar na portaria',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    orderNumber: 'PED-004',
    customer: 'Ana Costa',
    status: 'delivery',
    total: 89.9,
    items: [
      {
        id: '7',
        name: 'Pizza Média',
        quantity: 1,
        price: 67.9,
        image:
          'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '8',
        name: 'Refrigerante Lata',
        quantity: 2,
        price: 22.0,
        image: '',
      },
    ],
    paymentMethod: 'money',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    orderNumber: 'PED-005',
    customer: 'Carlos Mendes',
    status: 'completed',
    total: 156.7,
    items: [
      {
        id: '9',
        name: 'Pizza Gigante',
        quantity: 1,
        price: 120.9,
        image:
          'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '10',
        name: 'Cerveja Long Neck',
        quantity: 3,
        price: 35.8,
        image: '/images/products/cerveja-long-neck.jpg',
      },
    ],
    paymentMethod: 'pix',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    orderNumber: 'PED-006',
    customer: 'Lucia Ferreira',
    status: 'delivery',
    total: 78.9,
    items: [
      {
        id: '11',
        name: 'Pizza Pequena',
        quantity: 1,
        price: 48.9,
        image:
          'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      { id: '12', name: 'Água Mineral', quantity: 2, price: 30.0, image: '' },
    ],
    paymentMethod: 'money',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    orderNumber: 'PED-007',
    customer: 'Roberto Alves',
    status: 'delivery',
    total: 167.8,
    items: [
      {
        id: '13',
        name: 'Pizza Especial',
        quantity: 1,
        price: 127.9,
        image:
          'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '14',
        name: 'Refrigerante 2L',
        quantity: 2,
        price: 39.9,
        image: '',
      },
    ],
    paymentMethod: 'money',
    createdAt: new Date().toISOString(),
  },
]

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula um delay de carregamento
    const timer = setTimeout(() => {
      setOrders(MOCK_ORDERS)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return {
    orders,
    isLoading,
  }
}
