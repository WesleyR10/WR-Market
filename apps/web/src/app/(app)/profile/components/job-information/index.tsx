'use client'

import { Button } from '@/components/ui/button'

import { columns, Job } from './columns'
import { DataTable } from './data-table'

interface JobInformationProps {
  jobs: Job[]
}

export function JobInformation({ jobs }: JobInformationProps) {
  return (
    <div className="w-full space-y-4">
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Job Information</h2>
        <Button variant="ghost" size="sm">
          + Add Info
        </Button>
      </div>

      <DataTable columns={columns} data={jobs} />
    </div>
  )
}
