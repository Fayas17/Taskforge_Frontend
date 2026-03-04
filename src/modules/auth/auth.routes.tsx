import type { RouteObject } from 'react-router-dom'
import RegisterPage from './RegisterPage'

export const authRoutes: RouteObject[] = [
    {
        path: '/register',
        element: <RegisterPage />,
    },
]
