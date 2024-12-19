'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React, { createContext, useContext } from 'react'

import { getProfile, GetProfileResponse } from '@/http/auth/get-profile'

interface UserContextProps {
  user: GetProfileResponse['user'] // Agora referencia o tipo user interno
  isLoading: boolean
  isError: boolean
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    retry: 1, // Limita a quantidade de tentativas de refetch
    // staleTime: 1000 * 60 * 5, // Dados considerados fresh por 5 minutos
  })

  if (!isLoading && !userProfile) {
    redirect('/auth/sign-in')
  }

  // Só renderiza o children quando tiver os dados do usuário
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  // Aqui garantimos que userProfile não é undefined
  if (!userProfile) {
    return null
  }

  return (
    <UserContext.Provider
      value={{ user: userProfile.user, isLoading, isError }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
