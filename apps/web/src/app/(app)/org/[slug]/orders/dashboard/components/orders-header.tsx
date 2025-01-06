'use client'

import { Filter, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function OrdersHeader() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie seus pedidos em tempo real
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar pedido..." className="w-[250px] pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>
    </div>
  )
}
