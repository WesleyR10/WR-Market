'use client'

import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getCategoriesData } from '../actions'
import { CategoryDialog } from './category-dialog'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const params = useParams()

  const { data: categories } = useQuery({
    queryKey: ['categories', params.slug],
    queryFn: () => getCategoriesData(params.slug as string),
    // Configurações adicionais para garantir o fetch inicial
    enabled: !!params.slug, // Só executa se tivermos o slug
    initialData: [], // Valor inicial para evitar undefined
    refetchOnMount: true, // Força o refetch quando o componente monta
  })

  return (
    <>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria..." />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="icon"
          variant="outline"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
