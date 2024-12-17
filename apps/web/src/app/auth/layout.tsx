import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { CarouselComponent } from '@/components/auth/carousel'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-zinc-900 max-xl:justify-center">
      <div className="h-full w-1/2 max-xl:hidden">
        <div className="flex h-full w-full flex-col items-center justify-center gap-16  pr-8">
          <CarouselComponent />
        </div>
      </div>
      <div className="flex h-full w-1/2 flex-col items-center justify-center gap-8 max-2xl:gap-4 max-xl:w-full">
        {children}
      </div>
    </div>
  )
}
