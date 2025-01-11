export interface ApiError extends Error {
  code: string
  message: string
  details?: Record<string, unknown>
  response?: {
    status: number
    data?: {
      message?: string
      code?: string
      details?: Record<string, unknown>
    }
  }
  isForbidden?: boolean
}
