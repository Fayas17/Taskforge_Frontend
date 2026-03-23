import { useEffect, useState, type ReactNode } from 'react'
import { api } from '@/api/axios'
import type { User } from '@/modules/auth/auth.types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)

    const checkAuth = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('auth/me/')
            setUser(response.data)
            setIsAuthenticated(true)
            localStorage.setItem('isAuthenticated', 'true')
        } catch {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem('isAuthenticated')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()

        const handleUnauthorized = () => {
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem('isAuthenticated')
        }
        window.addEventListener('unauthorized', handleUnauthorized)
        return () =>
            window.removeEventListener('unauthorized', handleUnauthorized)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                setIsAuthenticated,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
