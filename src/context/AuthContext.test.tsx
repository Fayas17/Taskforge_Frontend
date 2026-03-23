import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from './AuthContext'
import { useAuth } from './auth-context'
import { api } from '@/api/axios'

// Mock the API
vi.mock('@/api/axios', () => ({
    api: {
        get: vi.fn(),
    },
}))

// Helper component to test useAuth hook
const TestComponent = () => {
    const { isAuthenticated, user, isLoading } = useAuth()
    if (isLoading) return <div>Loading...</div>
    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <div data-testid="user-email">{user?.email || 'No User'}</div>
        </div>
    )
}

describe('AuthContext / AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    it('should initialize as loading and then authenticate if a valid user is returned', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
        }
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
        )

        // Should initially show loading or not authenticated (depending on timing)
        // But eventually should show authenticated
        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent(
                'Authenticated',
            )
            expect(screen.getByTestId('user-email')).toHaveTextContent(
                'test@example.com',
            )
        })

        expect(api.get).toHaveBeenCalledWith('auth/me/')
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'isAuthenticated',
            'true',
        )
    })

    it('should handle authentication failure correctly', async () => {
        vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
        )

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent(
                'Not Authenticated',
            )
            expect(screen.getByTestId('user-email')).toHaveTextContent(
                'No User',
            )
        })

        expect(window.localStorage.removeItem).toHaveBeenCalledWith(
            'isAuthenticated',
        )
    })

    it('should react to "unauthorized" window events', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
        }
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
        )

        // Wait for initial auth
        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent(
                'Authenticated',
            )
        })

        // Emit unauthorized event
        window.dispatchEvent(new Event('unauthorized'))

        // Should now be unauthenticated
        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent(
                'Not Authenticated',
            )
        })
        expect(window.localStorage.removeItem).toHaveBeenCalledWith(
            'isAuthenticated',
        )
    })
})
