import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Skeleton from 'react-loading-skeleton'

export default function CatchAllRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <Skeleton height="100vh" />
    }

    return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />
}
