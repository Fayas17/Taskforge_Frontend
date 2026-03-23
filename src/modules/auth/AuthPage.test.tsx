import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthPage from './AuthPage'
import { login } from './auth.service'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { axe } from 'vitest-axe'

vi.mock('./auth.service', () => ({
    login: vi.fn(),
}))

vi.mock('@/api/axios', () => ({
    api: { get: vi.fn().mockRejectedValue(new Error('Not authenticated')) },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

describe('AuthPage (Login)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render the login form correctly', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )

        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /Login Now/i }),
        ).toBeInTheDocument()
    })

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('should show an error if fields are empty and submitted', async () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('button', { name: /Login Now/i }))

        expect(
            await screen.findByText(/Please fill in both fields/i),
        ).toBeInTheDocument()
    })

    it('should call login service and navigate on success', async () => {
        vi.mocked(login).mockResolvedValueOnce({ message: 'Login successful' })

        render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'password123' },
        })
        fireEvent.click(screen.getByRole('button', { name: /Login Now/i }))

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('should show api error message on failure', async () => {
        vi.mocked(login).mockRejectedValueOnce(new Error('Invalid credentials'))

        render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'wrong-pass' },
        })
        fireEvent.click(screen.getByRole('button', { name: /Login Now/i }))

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
        })
    })

    it('should disable button and show loading text when submitting', async () => {
        vi.mocked(login).mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        )

        render(
            <MemoryRouter>
                <AuthProvider>
                    <AuthPage />
                </AuthProvider>
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'password123' },
        })
        fireEvent.click(screen.getByRole('button', { name: /Login Now/i }))

        const loginBtn = screen.getByRole('button', { name: /Logging in…/i })
        expect(loginBtn).toBeInTheDocument()
        expect(loginBtn).toBeDisabled()
    })
})
