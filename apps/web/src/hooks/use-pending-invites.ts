import { useQuery } from '@tanstack/react-query'

import { getPendingInvites } from '@/http/invite/get-pending-invites'
import type { PendingInvitesResponse } from '@/types/invite'

export function usePendingInvites() {
  return useQuery<PendingInvitesResponse>({
    queryKey: ['pendingInvites'],
    queryFn: getPendingInvites,
  })
}
