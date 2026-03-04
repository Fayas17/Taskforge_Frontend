import { createBrowserRouter } from 'react-router-dom'
import { authRoutes } from '@/modules/auth/auth.routes'

export const router = createBrowserRouter([...authRoutes])
