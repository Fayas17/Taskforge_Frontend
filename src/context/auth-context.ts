import { createContext, useContext } from 'react'
import type { User } from '@/modules/auth/auth.types'

export interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: User | null
    setIsAuthenticated: (val: boolean) => void
    checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
