'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Role } from '@wr-market/auth'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getRoleLabel } from '@/lib/utils'

interface Team {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
  role: Role
}

interface TeamSwitcherProps {
  teams: Team[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2] // Pega o slug do URL atual
  const queryClient = useQueryClient()

  const [activeTeam, setActiveTeam] = React.useState<Team | null>(null)

  useEffect(() => {
    const matchingTeam = teams.find((team) => team.slug === currentSlug)

    if (matchingTeam && (!activeTeam || activeTeam.slug !== currentSlug)) {
      setActiveTeam(matchingTeam)
    }
  }, [currentSlug, teams, activeTeam])

  const handleTeamChange = (team: Team) => {
    setActiveTeam(team)
    // Pega o path atual após o slug da organização
    queryClient.invalidateQueries({ queryKey: ['userProfile'] })

    const currentPath = pathname.split('/').slice(3).join('/')
    router.push(`/org/${team.slug}/${currentPath}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={activeTeam?.avatarUrl ?? ''}
                  alt={activeTeam?.name}
                />
                <AvatarFallback className="bg-sidebar-primary text-sm text-sidebar-primary-foreground">
                  {activeTeam?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {activeTeam?.name}
                </span>
                <span className="truncate text-xs">{activeTeam?.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className="cursor-pointer gap-2 p-2"
              >
                <Avatar className="size-6">
                  <AvatarImage src={team.avatarUrl ?? ''} alt={team.name} />
                  <AvatarFallback className="text-xs">
                    {team.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {team.name}{' '}
                  <span className="text-muted-foreground">
                    ({getRoleLabel(team.role)})
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
