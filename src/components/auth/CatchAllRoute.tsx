import { Navigate } from 'react-router-dom'

export default function CatchAllRoute() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />
}
