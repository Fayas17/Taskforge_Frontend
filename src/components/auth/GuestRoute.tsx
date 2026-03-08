import { Navigate, useLocation } from 'react-router-dom'

export default function GuestRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()

    // We check a safe UI flag string set by the login page,
    // because real JWT tokens are now secured in HttpOnly cookies!
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    if (isAuthenticated) {
        // Sends logged-in users away from auth pages natively!
        return <Navigate to="/dashboard" state={{ from: location }} replace />
    }

    return <>{children}</>
}
