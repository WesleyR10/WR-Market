'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'Ativo' | 'Inativo' | 'Pendente'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses = {
    Ativo: 'bg-green-100 text-green-800',
    Inativo: 'bg-red-100 text-red-800',
    Pendente: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <Badge className={cn('capitalize', statusClasses[status])}>{status}</Badge>
  )
}
