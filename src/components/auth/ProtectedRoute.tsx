import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
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

    // Splash screen holding the view while Auth Context checks the server
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

    // Intercept Google OAuth callback on the frontend:
    // If backend redirects to FRONTEND_URL/dashboard?login_success=true
    if (searchParams.get('login_success') === 'true' && !isAuthenticated) {
        localStorage.setItem('isAuthenticated', 'true')
        setIsAuthenticated(true)

        // Optionally, completely strip the query param from the URL using History API to keep it clean
        window.history.replaceState({}, document.title, location.pathname)
        return <>{children}</>
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted URL
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <>{children}</>
}
