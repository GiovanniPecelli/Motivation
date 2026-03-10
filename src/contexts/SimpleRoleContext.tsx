import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

interface SimpleRoleContextType {
  isHost: boolean
  isCustomer: boolean
  canManageProducts: boolean
  canViewAdminPanel: boolean
}

const SimpleRoleContext = createContext<SimpleRoleContextType | undefined>(undefined)

export function SimpleRoleProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  
  const isHost = profile?.role === 'host'
  const isCustomer = profile?.role === 'customer'
  const canManageProducts = isHost
  const canViewAdminPanel = isHost

  const value = {
    isHost,
    isCustomer,
    canManageProducts,
    canViewAdminPanel
  }

  return (
    <SimpleRoleContext.Provider value={value}>
      {children}
    </SimpleRoleContext.Provider>
  )
}

export function useSimpleRole() {
  const context = useContext(SimpleRoleContext)
  if (context === undefined) {
    throw new Error('useSimpleRole must be used within a SimpleRoleProvider')
  }
  return context
}
