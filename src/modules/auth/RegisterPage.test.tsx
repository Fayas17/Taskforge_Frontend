import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterPage from './RegisterPage'
import { register } from './auth.service'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'

// Mock the register service
vi.mock('./auth.service', () => ({
    register: vi.fn(),
}))

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render the registration form correctly', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
        )

        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText(/Confirm Password/i),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /Create Account/i }),
        ).toBeInTheDocument()
    })

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('should show an error if passwords do not match', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: 'user', name: 'username' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'user@example.com', name: 'email' },
        })
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
            target: { value: 'pass1', name: 'password' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
            target: { value: 'pass2', name: 'confirmpassword' },
        })

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

        await waitFor(() => {
            expect(
                screen.getByText(/Passwords do not match/i),
            ).toBeInTheDocument()
        })
    })

    it('should call register service and show success on success', async () => {
        vi.mocked(register).mockResolvedValueOnce({
            email: 'test@example.com',
            username: 'testuser',
        })

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: 'testuser', name: 'username' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com', name: 'email' },
        })
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
            target: { value: 'password123', name: 'password' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
            target: { value: 'password123', name: 'confirmpassword' },
        })

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

        await waitFor(() => {
            expect(register).toHaveBeenCalled()
            expect(screen.getByText(/Account created/i)).toBeInTheDocument()
        })
    })

    it('should show api error message on failure', async () => {
        vi.mocked(register).mockRejectedValueOnce(
            new Error('User already exists'),
        )

        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>,
        )

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: 'testuser', name: 'username' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com', name: 'email' },
        })
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
            target: { value: 'password123', name: 'password' },
        })
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
            target: { value: 'password123', name: 'confirmpassword' },
        })

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

        await waitFor(() => {
            expect(screen.getByText(/User already exists/i)).toBeInTheDocument()
        })
    })
})
