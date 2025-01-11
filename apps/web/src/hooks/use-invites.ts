import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { listInvites } from '@/http/invite/list-invites'
import type { ApiError } from '@/types/error'

interface UseInvitesReturn {
  data: Awaited<ReturnType<typeof listInvites>> | undefined
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  isForbidden: boolean
}

export function useInvites(enabled = true): UseInvitesReturn {
  const params = useParams()
  const orgSlug = params.slug as string

  const query = useQuery({
    queryKey: ['invites', orgSlug],
    queryFn: async () => {
      try {
        return await listInvites(orgSlug)
      } catch (err) {
        const error = err as unknown as ApiError
        if (error.response?.status === 403) {
          error.isForbidden = true
        }
        throw error
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!orgSlug && enabled,
  })

  return {
    ...query,
    isForbidden: (query.error as ApiError)?.isForbidden ?? false,
    error: query.error as ApiError | null,
  }
}
