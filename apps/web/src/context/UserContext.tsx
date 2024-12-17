'use client'

import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext } from 'react'

import { getProfile, GetProfileResponse } from '@/http/get-profile'

interface UserContextProps {
  user: GetProfileResponse | null
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
  })

  return (
    <UserContext.Provider
      value={{ user: userProfile || null, isLoading, isError }}
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
