import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const { isAuthenticated, isLoading, setIsAuthenticated } = useAuth()

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

    // Intercept Google OAuth callback: backend redirects to /dashboard?login_success=true
    if (searchParams.get('login_success') === 'true' && !isAuthenticated) {
        localStorage.setItem('isAuthenticated', 'true')
        setIsAuthenticated(true)
        window.history.replaceState({}, document.title, location.pathname)
        return <>{children}</>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <>{children}</>
}
