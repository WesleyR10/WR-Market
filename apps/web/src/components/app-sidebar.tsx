import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LucideIcon,
  MessageCircle,
  Search,
  Settings,
} from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

type SubMenuItem = {
  title: string
  url: string
  badge?: string
}

type MenuItem = {
  title: string
  url: string
  icon: LucideIcon
  badge?: string
  submenu?: SubMenuItem[]
}

// Menu items
const items: MenuItem[] = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
    submenu: [
      { title: 'Unread', url: '#', badge: '5' }, // Badge no subitem
      { title: 'Archived', url: '#' },
    ],
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    submenu: [
      { title: 'Profile', url: '#' },
      { title: 'Preferences', url: '#', badge: 'New' },
    ],
  },
  {
    title: 'Feedback',
    url: '#',
    icon: MessageCircle,
    badge: '3', // Badge no item principal
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible key={item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    {item.submenu ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subitem) => (
                              <SidebarMenuSubItem key={subitem.title}>
                                <a
                                  href={subitem.url}
                                  className="flex w-full items-center justify-between"
                                >
                                  <span>{subitem.title}</span>
                                  {subitem.badge && (
                                    <SidebarMenuBadge>
                                      {subitem.badge}
                                    </SidebarMenuBadge>
                                  )}
                                </a>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
