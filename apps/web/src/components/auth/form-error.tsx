import { AlertTriangle } from 'lucide-react'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="mb-2 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
