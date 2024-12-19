'use client'

import { CalendarDays, DollarSign } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ActivityItem {
  user: string
  action: string
  date: string
  time: string
  avatar?: string
}

interface CompensationItem {
  amount: string
  period: string
  effectiveDate: string
}

interface ActivityCompensationProps {
  activities: ActivityItem[]
  compensations: CompensationItem[]
}

export function ActivityCompensation({
  activities,
  compensations,
}: ActivityCompensationProps) {
  return (
    <div className="flex gap-4 py-4">
      <Card className="flex-1 border-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.date}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator orientation="vertical" className="h-auto" />

      <Card className="flex-1 border-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Compensation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {compensations.map((compensation, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{compensation.amount}</span>
                <span className="text-sm text-muted-foreground">
                  {compensation.period}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Effective date on {compensation.effectiveDate}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
