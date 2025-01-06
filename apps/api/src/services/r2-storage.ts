import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@wr-market/env'

import { r2Client } from '../lib/r2Client'

export class R2StorageService {
  private static buildImageUrl(key: string): string {
    return `${env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL}${key}`
  }

  private static getKeyFromUrl(imageUrl: string): string | null {
    try {
      const url = new URL(imageUrl)
      const key = url.pathname.substring(1)

      return key || null
    } catch (error) {
      console.error('Erro ao extrair chave da URL:', error)
      return null
    }
  }

  static async uploadImage(
    file: Buffer,
    organizationSlug: string,
    fileName: string,
    contentType: string,
  ): Promise<string | null> {
    try {
      // Sanitize file name for use in URL (remove special chars, spaces to dashes, etc)
      const sanitizedFileName = fileName
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const key = `${organizationSlug}/${sanitizedFileName}`

      const params = {
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
      }

      const command = new PutObjectCommand(params)
      await r2Client.send(command)

      return this.buildImageUrl(key)
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', {
        error,
      })
      return null
    }
  }

  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const key = this.getKeyFromUrl(imageUrl)

      if (!key) {
        console.error('Não foi possível extrair a chave da URL:', imageUrl)
        return false
      }

      const deleteParams = {
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      }

      const deleteCommand = new DeleteObjectCommand(deleteParams)
      await r2Client.send(deleteCommand)
      return true
    } catch (error) {
      console.error(`Erro ao deletar a imagem do R2:`, {
        url: imageUrl,
        error,
      })
      return false
    }
  }
}
