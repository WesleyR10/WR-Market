'use client'

import { Loader2, Trash, Upload } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import {
  deleteProductImageAction,
  uploadProductImagesAction,
} from '@/app/(app)/org/[slug]/products/new/actions'
import { FileUpload } from '@/components/aceternity-UI/file-upload'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const params = useParams()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = useCallback(
    async (files: File[]) => {
      if (!files.length) return

      try {
        setIsUploading(true)

        // Gerar previews antes do upload usando as URLs locais
        const newPreviewUrls = files.map((file) => {
          const previewUrl = URL.createObjectURL(file)
          return previewUrl
        })

        setPreviewUrls((current) => [...current, ...newPreviewUrls])

        const result = await uploadProductImagesAction(
          params.slug as string,
          files,
        )

        if (!result.success || !result.images) {
          throw new Error(result.error || 'Erro ao fazer upload')
        }

        // Atualizar com as URLs do Cloudflare
        onChange([...value, ...result.images])

        // Limpar os previews locais
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
        setPreviewUrls([])

        toast({
          title: 'Sucesso!',
          description: 'Imagens enviadas com sucesso',
          variant: 'default',
        })
      } catch (error) {
        console.error('Erro no upload:', error)
        // Limpar previews em caso de erro
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        setPreviewUrls([])

        toast({
          title: 'Erro no upload',
          description:
            error instanceof Error
              ? error.message
              : 'Erro ao fazer upload das imagens',
          variant: 'destructive',
        })
      } finally {
        setIsUploading(false)
      }
    },
    [params.slug, value, onChange, toast],
  )

  // Limpar URLs de preview quando o componente for desmontado
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const removeImage = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange],
  )

  const handleDeleteImage = useCallback(
    async (imageUrl: string, index: number) => {
      try {
        // Deleta a imagem da Cloudflare R2
        const result = await deleteProductImageAction(
          params.slug as string,
          imageUrl, // Passamos apenas a URL da imagem
        )

        if (!result.success) {
          throw new Error(result.error)
        }

        // Remove a imagem do estado local
        removeImage(index)

        toast({
          title: 'Sucesso!',
          description: 'Imagem deletada com sucesso',
          variant: 'default',
        })
      } catch (error) {
        console.error('Erro ao deletar imagem:', error)
        toast({
          title: 'Erro ao deletar',
          description:
            error instanceof Error ? error.message : 'Erro ao deletar a imagem',
          variant: 'destructive',
        })
      }
    },
    [params.slug, value, onChange, removeImage, toast],
  )

  return (
    <div className="space-y-4">
      <FileUpload
        onChange={handleFileChange}
        acceptedFileTypes={['image/*']}
        currentFiles={value.length}
        disabled={disabled || isUploading}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-medium">
              {isUploading
                ? 'Fazendo upload...'
                : 'Arraste suas imagens ou clique aqui'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPEG ou WebP até 10MB
            </p>
          </div>
        </div>
      </FileUpload>

      <div className="grid grid-cols-4 gap-4">
        {/* Imagens já carregadas */}
        {value.map((image, index) => {
          return (
            <div key={`uploaded-${index}`} className="aspect-square relative">
              <div className="h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 z-10"
                  onClick={() => handleDeleteImage(image, index)}
                  disabled={disabled || isUploading}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}

        {/* Previews de upload em andamento */}
        {previewUrls.map((url, index) => (
          <div key={`preview-${index}`} className="aspect-square relative">
            <div className="h-full w-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="h-full w-full object-cover opacity-50"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
