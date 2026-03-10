import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import './index.css'
import '@/api/interceptors' // Make sure the Axios interceptors are loaded and attached

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ErrorBoundary>
    </StrictMode>,
)
