import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import AuthPage from '@/modules/auth/AuthPage'
import RegisterPage from '@/modules/auth/RegisterPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import DashboardPage from '@/modules/dashboard/DashboardPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import GuestRoute from '@/components/auth/GuestRoute'
import CatchAllRoute from '@/components/auth/CatchAllRoute'

export type LayoutType = 'auth' | 'dashboard' | 'main' | 'none'

export type AppRouteConfig = Omit<RouteObject, 'children'> & {
    protected?: boolean
    guest?: boolean
    layout?: LayoutType
    children?: AppRouteConfig[]
}

const routes: AppRouteConfig[] = [
    // --- Auth Routes ---
    {
        path: '/',
        layout: 'none',
        guest: true, // Only allow access if user is logged out
        element: <AuthPage />,
    },
    {
        path: '/register',
        layout: 'none',
        guest: true, // Only allow access if user is logged out
        element: <RegisterPage />,
    },

    // --- Dashboard Routes ---
    {
        path: '/dashboard',
        layout: 'dashboard',
        protected: true, // Only allow access if user is logged in
        children: [{ index: true, element: <DashboardPage /> }],
    },

    // --- Catch-all Route for Unknown Pages (/logout, /login, etc) ---
    {
        path: '*',
        layout: 'none',
        element: <CatchAllRoute />,
    },
]

// Render elements wrapped with Guard and Layout based on config
function renderRoute(route: AppRouteConfig): RouteObject {
    let element = route.element

    // Add layout
    if (route.layout === 'dashboard') {
        element = <DashboardLayout />
    }

    // Add guards prioritizing protectiveness natively wrapping each other
    if (route.protected && element) {
        element = <ProtectedRoute>{element}</ProtectedRoute>
    } else if (route.guest && element) {
        // Keeps logged in users out of Auth and Register screens!
        element = <GuestRoute>{element}</GuestRoute>
    }

    // Map children recursively
    const children = route.children?.map(renderRoute)

    return {
        ...route,
        element,
        children,
    } as RouteObject
}

export const router = createBrowserRouter(routes.map(renderRoute))
