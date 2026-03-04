import type { RouteObject } from 'react-router-dom'
import AuthPage from './AuthPage'
import RegisterPage from './RegisterPage'

export const authRoutes: RouteObject[] = [
    {
        path: '/',
        // element: <MainLayout />,
        children: [
            { index: true, element: <AuthPage /> },
            { path: 'register', element: <RegisterPage /> },
            //   { path: "login", element: <Login /> },
        ],
    },
]
