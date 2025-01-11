'use client'

import { CompactInvites } from './org/[slug]/team/invites/components/compact-invites'

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Convites Pendentes</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie os convites que você recebeu para participar de organizações
          <div className="flex justify-end">
            <CompactInvites />
          </div>
        </p>
      </div>
    </div>
  )
}
