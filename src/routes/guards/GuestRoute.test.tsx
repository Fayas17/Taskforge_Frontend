import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GuestRoute from './GuestRoute'
import { useAuth } from '@/hooks/useAuth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}))

describe('GuestRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should show loader when loading', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            user: null,
            setIsAuthenticated: vi.fn(),
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter>
                <GuestRoute>
                    <div>Guest Content</div>
                </GuestRoute>
            </MemoryRouter>,
        )

        expect(screen.queryByText('GuestContent')).not.toBeInTheDocument()
    })

    it('should redirect to dashboard if authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: null,
            setIsAuthenticated: vi.fn(),
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/dashboard" element={<div>Dashboard</div>} />
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <div>Guest Content</div>
                            </GuestRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should render children if NOT authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            setIsAuthenticated: vi.fn(),
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/login']}>
                <GuestRoute>
                    <div>Guest Content</div>
                </GuestRoute>
            </MemoryRouter>,
        )

        expect(screen.getByText('Guest Content')).toBeInTheDocument()
    })
})
