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

/**
 * Hook to access authentication state and actions.
 * Must be used inside <AuthProvider> — throws if called outside it.
 */
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
