import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}))

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should show a loader when isLoading is true', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            setIsAuthenticated: vi.fn(),
            user: null,
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>,
        )

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should redirect to login if not authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            setIsAuthenticated: vi.fn(),
            user: null,
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/" element={<div>Login Page</div>} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should render children if authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            setIsAuthenticated: vi.fn(),
            user: null,
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should handle login_success query param correctly', () => {
        const setIsAuthenticated = vi.fn()
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            setIsAuthenticated,
            user: null,
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/dashboard?login_success=true']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(setIsAuthenticated).toHaveBeenCalledWith(true)
        expect(window.localStorage.getItem('isAuthenticated')).toBe('true')
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
})
