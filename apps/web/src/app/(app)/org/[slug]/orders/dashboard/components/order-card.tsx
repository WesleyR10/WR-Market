'use client'

import { ArrowUpRight, Banknote, CreditCard, QrCode } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { type Order } from '@/types/order'
import { formatCurrency } from '@/utils/currency'

import { StatusBadge } from './status-badge'

interface OrderCardProps {
  order: Order
}

const paymentMethodIcons = {
  credit_card: <CreditCard className="h-4 w-4" />,
  debit_card: <CreditCard className="h-4 w-4" />,
  pix: <QrCode className="h-4 w-4" />,
  money: <Banknote className="h-4 w-4" />,
}

const paymentMethodLabels = {
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  pix: 'PIX',
  money: 'Dinheiro',
}

export function OrderCard({ order }: OrderCardProps) {
  const remainingItems = order.items.length - 2

  return (
    <Card className="h-full cursor-pointer transition-colors hover:bg-accent/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>
              {order.customer.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-xs text-muted-foreground">
              #{order.orderNumber}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="mb-4 flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          {paymentMethodIcons[order.paymentMethod]}
          <span>{paymentMethodLabels[order.paymentMethod]}</span>
        </div>

        <div className="space-y-3">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border">
                <img
                  src={item.image || '/placeholder-food.jpg'}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {item.quantity}x
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {remainingItems > 0 && (
            <div className="text-end text-xs text-muted-foreground">
              +{remainingItems} more {remainingItems === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>

        {order.observation && (
          <div className="mt-3 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
            <strong>Obs:</strong> {order.observation}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="secondary" className="w-full justify-between text-xs">
          Ver detalhes
          <ArrowUpRight className="h-4 w-4 -rotate-12" />
        </Button>
      </CardFooter>
    </Card>
  )
}
