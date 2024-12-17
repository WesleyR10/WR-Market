'use client'

import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { SidebarGroup } from '@/components/ui/sidebar'

export function SearchBar() {
  return (
    <SidebarGroup className="px-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
        <Input
          type="search"
          placeholder="Search..."
          className="bg-sidebar-muted/30 border-0 pl-8 text-white placeholder:text-white/70 focus-visible:ring-1 focus-visible:ring-sidebar-ring"
        />
      </div>
    </SidebarGroup>
  )
}
