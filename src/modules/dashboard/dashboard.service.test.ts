import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUser, refreshToken, logoutUser } from './dashboard.service'
import { api } from '@/api/axios'

vi.mock('@/api/axios', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}))

describe('dashboard.service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    describe('getCurrentUser()', () => {
        it('should call /auth/me/ and return user data', async () => {
            const mockUser = { id: 1, email: 'user@test.com', username: 'user' }
            vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser })

            const result = await getCurrentUser()

            expect(api.get).toHaveBeenCalledWith('/auth/me/')
            expect(result).toEqual(mockUser)
        })

        it('should propagate errors', async () => {
            vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))

            await expect(getCurrentUser()).rejects.toThrow('Unauthorized')
        })
    })

    describe('refreshToken()', () => {
        it('should call auth/refresh/ and return response data', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({ data: { ok: true } })

            const result = await refreshToken()

            expect(api.post).toHaveBeenCalledWith('auth/refresh/')
            expect(result).toEqual({ ok: true })
        })
    })

    describe('logoutUser()', () => {
        it('should call auth/logout/ and clear isAuthenticated from localStorage', async () => {
            window.localStorage.setItem('isAuthenticated', 'true')
            vi.mocked(api.post).mockResolvedValueOnce({})

            await logoutUser()

            expect(api.post).toHaveBeenCalledWith('auth/logout/')
            expect(window.localStorage.removeItem).toHaveBeenCalledWith(
                'isAuthenticated',
            )
        })

        it('should still clear localStorage even if the API call fails', async () => {
            window.localStorage.setItem('isAuthenticated', 'true')
            vi.mocked(api.post).mockRejectedValueOnce(
                new Error('Network error'),
            )

            await logoutUser()

            expect(window.localStorage.removeItem).toHaveBeenCalledWith(
                'isAuthenticated',
            )
        })
    })
})
