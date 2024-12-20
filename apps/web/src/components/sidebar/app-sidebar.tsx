'use client'

import { useQuery } from '@tanstack/react-query'
import {
  AudioWaveform,
  BarChart,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Package,
  PieChart,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Users,
  Users2,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavProjects } from '@/components/sidebar/nav-projects'
import { NavUser } from '@/components/sidebar/nav-user'
import { SearchBar } from '@/components/sidebar/search'
import { TeamSwitcher } from '@/components/sidebar/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUser } from '@/context/UserContext'
import {
  getOrganizations,
  GetOrganizationsResponse,
} from '@/http/get-organizations'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
      items: [], // Sem subitens
    },
    {
      title: 'Vendas',
      url: '/sales',
      icon: ShoppingCart,
      items: [
        {
          title: 'Nova Venda',
          url: '/sales/new',
        },
        {
          title: 'Histórico',
          url: '/sales/history',
        },
        {
          title: 'Entregas',
          url: '/sales/deliveries',
        },
      ],
    },
    {
      title: 'Produtos',
      url: '/products',
      icon: Package,
      items: [
        {
          title: 'Catálogo',
          url: '/products/catalog',
        },
        {
          title: 'Categorias',
          url: '/products/categories',
        },
        {
          title: 'Estoque',
          url: '/products/stock',
        },
      ],
    },
    {
      title: 'Compras',
      url: '/purchases',
      icon: ShoppingBag,
      items: [
        {
          title: 'Nova Compra',
          url: '/purchases/new',
        },
        {
          title: 'Histórico',
          url: '/purchases/history',
        },
        {
          title: 'Fornecedores',
          url: '/purchases/suppliers',
        },
      ],
    },
    {
      title: 'Clientes',
      url: '/clients',
      icon: Users,
      items: [
        {
          title: 'Lista',
          url: '/clients/list',
        },
        {
          title: 'Cadastro',
          url: '/clients/new',
        },
      ],
    },
    {
      title: 'Equipe',
      url: '/team',
      icon: Users2,
      items: [
        {
          title: 'Membros',
          url: '/team/members',
        },
        {
          title: 'Convites',
          url: '/team/invites',
        },
        {
          title: 'Funções',
          url: '/team/roles',
        },
      ],
    },
    {
      title: 'Relatórios',
      url: '/reports',
      icon: BarChart,
      items: [
        {
          title: 'Vendas',
          url: '/reports/sales',
        },
        {
          title: 'Estoque',
          url: '/reports/stock',
        },
        {
          title: 'Financeiro',
          url: '/reports/financial',
        },
      ],
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'Organização',
          url: '/settings/organization',
        },
        {
          title: 'Integrações',
          url: '/settings/integrations',
        },
        {
          title: 'Auditoria',
          url: '/settings/audit',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  const { user, isLoading, isError } = useUser()

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    isError: organizationsError,
    error,
  } = useQuery<GetOrganizationsResponse>({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  })

  if (isLoading || organizationsLoading) {
    return <div>Carregando...</div>
  }

  if (isError || organizationsError) {
    return <div>Ocorreu um erro: {(error as Error).message}</div>
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={organizationsData?.organizations ?? []} />
      </SidebarHeader>
      <SidebarContent>
        {open && <SearchBar />}
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
