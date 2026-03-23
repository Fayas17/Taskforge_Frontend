import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function GuestRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <Skeleton
                    count={1}
                    width={200}
                    height={40}
                    baseColor="#1f2937"
                    highlightColor="#374151"
                />
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />
    }

    return <>{children}</>
}
