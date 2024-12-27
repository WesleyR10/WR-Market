import { Badge } from '@/components/ui/badge'

const statusConfig = {
  pending: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Em Processamento', class: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Concluído', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
} as const

type OrderStatus = keyof typeof statusConfig

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={statusConfig[status].class}>
      {statusConfig[status].label}
    </Badge>
  )
}
