import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()

    // Using a UI state flag because real tokens are HttpOnly
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    if (!isAuthenticated) {
        // Redirect to login but save the attempted URL
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <>{children}</>
}
