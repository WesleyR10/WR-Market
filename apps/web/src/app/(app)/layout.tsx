import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserProvider } from '@/context/UserContext'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <UserProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <div className="container">
              <SidebarTrigger />
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </UserProvider>
  )
}
