'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { type CategoryFormValues, CategorySchema } from '@/schemas/category'

import { createCategoryAction } from '../actions'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      return createCategoryAction(params.slug as string, data)
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Categoria criada com sucesso',
          variant: 'default',
        })
        queryClient.invalidateQueries({
          queryKey: ['categories', params.slug],
        })
        form.reset()
        onOpenChange(false)
      } else {
        toast({
          title: 'Erro ao criar categoria',
          description: result.error,
          variant: 'destructive',
        })
      }
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    createCategory(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição da categoria (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                Criar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
