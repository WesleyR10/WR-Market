'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  MapPinHouse,
  MoreHorizontal,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/context/UserContext'
import { useToast } from '@/hooks/use-toast'
import { updateProfile, UpdateProfileRequest } from '@/http/auth/update-profile'

import { ActivityCompensation } from './components/activity-compensation'
import { EditProfileDialog } from './components/edit-profile-dialog'
import { JobInformation } from './components/job-information'

export default function ProfilePage() {
  const { user } = useUser()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast({
        title: 'Perfil atualizado!',
        description: data.message,
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      setIsDialogOpen(false)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar perfil: ' + error.message,
      })
    },
  })

  const onSubmitHandler = (data: UpdateProfileRequest) => {
    mutate(data)
  }

  const tabs = [
    {
      label: 'Overview',
      href: '/profile',
    },
    {
      label: 'Compensation',
      href: '/profile/compensation',
    },
    {
      label: 'Emergency',
      href: '/profile/emergency',
    },
    {
      label: 'Time Off',
      href: '/profile/time-off',
    },
    {
      label: 'Performance',
      href: '/profile/performance',
    },
    {
      label: 'Files',
      href: '/profile/files',
    },
    {
      label: 'Onboarding',
      href: '/profile/onboarding',
    },
  ]

  const jobs = [
    {
      department: 'Creative Associate',
      division: 'Project Management',
      manager: 'Alex Foster',
      hireDate: 'May 13, 2024',
      location: 'Metro DC',
    },
    {
      department: 'Software Engineering',
      division: 'Development',
      manager: 'Jessica Smith',
      hireDate: 'January 10, 2023',
      location: 'New York',
    },
    {
      department: 'Marketing',
      division: 'Digital Marketing',
      manager: 'Michael Johnson',
      hireDate: 'February 15, 2023',
      location: 'San Francisco',
    },
    {
      department: 'Human Resources',
      division: 'Recruitment',
      manager: 'Emily Davis',
      hireDate: 'March 20, 2023',
      location: 'Chicago',
    },
  ]

  const activities = [
    {
      user: 'John Miller',
      action: 'last login on',
      date: 'Jul 13, 2024',
      time: '05:36 PM',
      avatar: 'https://github.com/shadcn.png',
    },
    {
      user: 'Menas Sahin',
      action: 'date created on',
      date: 'Sep 08, 2024',
      time: '02:12 PM',
      avatar: 'https://github.com/shadcn.png',
    },
    {
      user: 'Tammy Collier',
      action: 'updated on',
      date: 'Aug 15, 2023',
      time: '03:36 PM',
      avatar: 'https://github.com/shadcn.png',
    },
  ]

  const compensations = [
    {
      amount: '892.00 USD',
      period: 'per month',
      effectiveDate: 'May 10, 2015',
    },
    {
      amount: '1560.00 USD',
      period: 'per quarter',
      effectiveDate: 'Jun 08, 2022',
    },
    {
      amount: '378.00 USD',
      period: 'per week',
      effectiveDate: 'Jun 08, 2022',
    },
  ]

  return (
    <section>
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 pl-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  whitespace-nowrap border-b-4 px-1 py-4 text-sm font-medium
                  ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex">
        {/* Coluna da esquerda - Perfil */}
        <div className="relative h-[calc(100vh-132px)] min-w-[300px] rounded-lg px-6 shadow">
          <div className="absolute right-0 top-0 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="my-6 flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16 rounded-lg">
                <AvatarImage
                  src={user.avatarUrl || ''}
                  alt={user.name || 'Profile'}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">#ERP-123456</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-medium text-gray-500">
                  Dados pessoais
                </h2>
                <div className="flex items-center gap-2">
                  <Phone className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{user.phone || '-'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user.email || '-'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-medium text-gray-500">Endereço</h2>

                <div className="flex items-center gap-2">
                  <MapPinHouse className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p>Rua Teste, 123</p>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Cidade</p>
                  <p>São Paulo</p>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Latitude</p>
                  <p>17.123456</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-medium text-gray-500">Empresa</h2>

                <div className="flex items-center gap-2">
                  <Calendar className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">
                    Data de admissão
                  </p>
                  <p>2024-01-01</p>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">
                    Departamento
                  </p>
                  <p>Marketing</p>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-[14px] w-[14px]" />
                  <p className="text-sm font-medium text-gray-500">Cargo</p>
                  <p>Gerente de Marketing</p>
                </div>
              </div>
            </div>
          </div>

          <EditProfileDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={onSubmitHandler}
            defaultValues={{
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              isTwoFactorEnabled: user.isTwoFactorEnabled,
            }}
            isPending={isPending}
          />
        </div>

        <Separator
          orientation="vertical"
          className="h-auto self-stretch bg-gray-200"
          decorative
        />

        {/* Coluna da Direita - Formulário */}
        <div className="flex-1 px-6">
          <JobInformation jobs={jobs} />
          <Separator />
          <ActivityCompensation
            activities={activities}
            compensations={compensations}
          />
        </div>
      </div>
    </section>
  )
}
