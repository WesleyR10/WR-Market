'use client'

import { columns, Product } from './components/columns'
import { DataTable } from './components/data-table'

const data: Product[] = [
  {
    id: '#172828898',
    rank: 1,
    name: 'Givench Sweater',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 12990,
    price: 1234.82,
    stock: 231,
    status: true,
    rating: 5,
  },
  {
    id: '#172828899',
    rank: 2,
    name: 'Givench Sweater',
    image:
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 12990,
    price: 2345.82,
    stock: 432,
    status: true,
    rating: 4,
  },
  {
    id: '#172828900',
    rank: 3,
    name: 'Givench Sweater',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 12990,
    price: 3456.82,
    stock: 654,
    status: true,
    rating: 3,
  },
  {
    id: '#172828901',
    rank: 4,
    name: 'Nike Air Max',
    image:
      'https://images.unsplash.com/photo-1465453869711-7e174808ace9?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 15000,
    price: 199.99,
    stock: 120,
    status: true,
    rating: 5,
  },
  {
    id: '#172828902',
    rank: 5,
    name: 'Adidas Ultraboost',
    image:
      'https://images.unsplash.com/photo-1516767254874-281bffac9e9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 11000,
    price: 179.99,
    stock: 200,
    status: true,
    rating: 4,
  },
  {
    id: '#172828903',
    rank: 6,
    name: 'Puma RS-X',
    image:
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 8000,
    price: 129.99,
    stock: 150,
    status: true,
    rating: 4,
  },
  {
    id: '#172828904',
    rank: 7,
    name: 'Reebok Classic',
    image:
      'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 6000,
    price: 89.99,
    stock: 300,
    status: true,
    rating: 3,
  },
  {
    id: '#172828905',
    rank: 8,
    name: 'New Balance 574',
    image:
      'https://images.unsplash.com/photo-1509418969973-c560ee8f02a0?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 5000,
    price: 99.99,
    stock: 250,
    status: true,
    rating: 4,
  },
  {
    id: '#172828906',
    rank: 9,
    name: 'Vans Old Skool',
    image:
      'https://images.unsplash.com/photo-1514514757092-71ebbc3db4e6?q=80&w=2095&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 7000,
    price: 69.99,
    stock: 180,
    status: false,
    rating: 1,
  },
  {
    id: '#172828907',
    rank: 10,
    name: 'Converse Chuck Taylor',
    image:
      'https://images.unsplash.com/photo-1508188239917-0fc5f653cb47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalBuyers: 9000,
    price: 59.99,
    stock: 220,
    status: true,
    rating: 4,
  },
  {
    id: '#172828908',
    rank: 11,
    name: 'H&M T-Shirt',
    image:
      'https://images.unsplash.com/photo-1601234567897-abcdef123463?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 15000,
    price: 19.99,
    stock: 500,
    status: true,
    rating: 5,
  },
  {
    id: '#172828909',
    rank: 12,
    name: 'Zara Jeans',
    image:
      'https://images.unsplash.com/photo-1601234567898-abcdef123464?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 12000,
    price: 49.99,
    stock: 300,
    status: true,
    rating: 4,
  },
  {
    id: '#172828910',
    rank: 13,
    name: "Levi's Jacket",
    image:
      'https://images.unsplash.com/photo-1601234567899-abcdef123465?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 8000,
    price: 89.99,
    stock: 150,
    status: true,
    rating: 5,
  },
  {
    id: '#172828911',
    rank: 14,
    name: 'Uniqlo Hoodie',
    image:
      'https://images.unsplash.com/photo-1601234567900-abcdef123466?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 7000,
    price: 39.99,
    stock: 200,
    status: true,
    rating: 4,
  },
  {
    id: '#172828912',
    rank: 15,
    name: 'Nike Shorts',
    image:
      'https://images.unsplash.com/photo-1601234567901-abcdef123467?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 6000,
    price: 29.99,
    stock: 250,
    status: true,
    rating: 3,
  },
  {
    id: '#172828913',
    rank: 16,
    name: 'Adidas Cap',
    image:
      'https://images.unsplash.com/photo-1601234567902-abcdef123468?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 5000,
    price: 24.99,
    stock: 300,
    status: true,
    rating: 4,
  },
  {
    id: '#172828914',
    rank: 17,
    name: 'Puma Backpack',
    image:
      'https://images.unsplash.com/photo-1601234567903-abcdef123469?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 4000,
    price: 49.99,
    stock: 150,
    status: true,
    rating: 5,
  },
  {
    id: '#172828915',
    rank: 18,
    name: 'Reebok Water Bottle',
    image:
      'https://images.unsplash.com/photo-1601234567904-abcdef123470?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 3000,
    price: 15.99,
    stock: 200,
    status: true,
    rating: 4,
  },
  {
    id: '#172828916',
    rank: 19,
    name: 'New Balance Socks',
    image:
      'https://images.unsplash.com/photo-1601234567905-abcdef123471?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 2000,
    price: 9.99,
    stock: 500,
    status: true,
    rating: 5,
  },
  {
    id: '#172828917',
    rank: 20,
    name: 'Vans Slip-On',
    image:
      'https://images.unsplash.com/photo-1601234567906-abcdef123472?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 1000,
    price: 49.99,
    stock: 300,
    status: true,
    rating: 4,
  },
  {
    id: '#172828918',
    rank: 21,
    name: 'Converse All Star',
    image:
      'https://images.unsplash.com/photo-1601234567907-abcdef123473?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 1500,
    price: 59.99,
    stock: 250,
    status: true,
    rating: 5,
  },
  {
    id: '#172828919',
    rank: 22,
    name: 'H&M Dress',
    image:
      'https://images.unsplash.com/photo-1601234567908-abcdef123474?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 800,
    price: 39.99,
    stock: 180,
    status: true,
    rating: 4,
  },
  {
    id: '#172828920',
    rank: 23,
    name: 'Zara Skirt',
    image:
      'https://images.unsplash.com/photo-1601234567909-abcdef123475?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 600,
    price: 49.99,
    stock: 150,
    status: true,
    rating: 3,
  },
  {
    id: '#172828921',
    rank: 24,
    name: "Levi's Shorts",
    image:
      'https://images.unsplash.com/photo-1601234567910-abcdef123476?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 400,
    price: 29.99,
    stock: 200,
    status: true,
    rating: 4,
  },
  {
    id: '#172828922',
    rank: 25,
    name: 'Uniqlo Pants',
    image:
      'https://images.unsplash.com/photo-1601234567911-abcdef123477?q=80&w=150&auto=format&fit=crop',
    totalBuyers: 300,
    price: 49.99,
    stock: 250,
    status: true,
    rating: 5,
  },
]

export default function CatalogPage() {
  return (
    <div className="px-4">
      <div className="mb-6">
        <h1 className="mb-1 text-3xl font-bold">Catalogo de Produtos</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todos os seus produtos em um único lugar
        </p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
