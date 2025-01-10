import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { listInvites } from '@/http/invite/list-invites'

export function useInvites() {
  const params = useParams()
  const orgSlug = params.slug as string

  return useQuery({
    queryKey: ['invites', orgSlug],
    queryFn: async () => {
      return await listInvites(orgSlug)
    },
    refetchOnWindowFocus: false,
    enabled: !!orgSlug,
  })
}
