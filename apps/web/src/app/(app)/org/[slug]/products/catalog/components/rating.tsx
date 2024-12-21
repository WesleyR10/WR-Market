'use client'

import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  className?: string
}

export function Rating({ value, className }: RatingProps) {
  const getScoreLabel = (score: number) => {
    if (score === 5) return 'Excelente'
    if (score === 4) return 'Muito Bom'
    if (score === 3) return 'Bom'
    if (score === 2) return 'Ruim'
    if (score === 1) return 'Péssimo'
    return ''
  }

  const getScoreColor = (score: number) => {
    if (score === 5) return 'bg-emerald-400'
    if (score === 4) return 'bg-emerald-500'
    if (score === 3) return 'bg-orange-500'
    if (score === 2) return 'bg-orange-500'
    if (score === 1) return 'bg-red-500'
    return ''
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="mb-1 text-sm font-medium text-muted-foreground">
        Avaliação: {getScoreLabel(value)}
      </span>
      <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-8 rounded-full',
              index < value ? getScoreColor(value) : 'bg-muted',
            )}
          />
        ))}
      </div>
    </div>
  )
}
