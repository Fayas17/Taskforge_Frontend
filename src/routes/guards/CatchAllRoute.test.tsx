import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CatchAllRoute from './CatchAllRoute'
import { useAuth } from '@/hooks/useAuth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}))

describe('CatchAllRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should show loader when isLoading is true', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            user: null,
            setIsAuthenticated: vi.fn(),
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <Routes>
                    <Route path="/unknown" element={<CatchAllRoute />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
        expect(screen.queryByText('Home/Login')).not.toBeInTheDocument()
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
            <MemoryRouter initialEntries={['/unknown']}>
                <Routes>
                    <Route path="/dashboard" element={<div>Dashboard</div>} />
                    <Route path="/unknown" element={<CatchAllRoute />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should redirect to home if NOT authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            setIsAuthenticated: vi.fn(),
            checkAuth: vi.fn(),
        })

        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <Routes>
                    <Route path="/" element={<div>Home/Login</div>} />
                    <Route path="/unknown" element={<CatchAllRoute />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Home/Login')).toBeInTheDocument()
    })
})
