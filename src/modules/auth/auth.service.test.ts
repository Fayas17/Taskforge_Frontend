import { describe, it, expect, vi, beforeEach } from 'vitest'
import { register, login } from './auth.service'
import { api } from '@/api/axios'

vi.mock('@/api/axios', () => ({
    api: {
        post: vi.fn(),
    },
}))

describe('auth.service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('register()', () => {
        it('should return response data on success', async () => {
            const mockData = { email: 'user@test.com', username: 'user' }
            vi.mocked(api.post).mockResolvedValueOnce({ data: mockData })

            const result = await register({
                username: 'user',
                email: 'user@test.com',
                password: 'pass123',
                confirmpassword: 'pass123',
            })

            expect(api.post).toHaveBeenCalledWith('auth/register/', {
                username: 'user',
                email: 'user@test.com',
                password: 'pass123',
                confirmpassword: 'pass123',
            })
            expect(result).toEqual(mockData)
        })

        it('should rethrow Error with the interceptor message on failure', async () => {
            vi.mocked(api.post).mockRejectedValueOnce(
                new Error('Email already registered'),
            )

            await expect(
                register({
                    username: 'user',
                    email: 'taken@test.com',
                    password: 'pass123',
                    confirmpassword: 'pass123',
                }),
            ).rejects.toThrow('Email already registered')
        })

        it('should throw a generic message on non-Error rejections', async () => {
            vi.mocked(api.post).mockRejectedValueOnce('network error')

            await expect(
                register({
                    username: 'user',
                    email: 'user@test.com',
                    password: 'pass',
                    confirmpassword: 'pass',
                }),
            ).rejects.toThrow('Registration failed')
        })
    })

    describe('login()', () => {
        it('should return response data on success', async () => {
            const mockData = { message: 'Login successful' }
            vi.mocked(api.post).mockResolvedValueOnce({ data: mockData })

            const result = await login({
                email: 'user@test.com',
                password: 'pass123',
            })

            expect(api.post).toHaveBeenCalledWith('auth/login/', {
                email: 'user@test.com',
                password: 'pass123',
            })
            expect(result).toEqual(mockData)
        })

        it('should rethrow Error with the interceptor message on failure', async () => {
            vi.mocked(api.post).mockRejectedValueOnce(
                new Error('Invalid credentials'),
            )

            await expect(
                login({ email: 'user@test.com', password: 'wrong' }),
            ).rejects.toThrow('Invalid credentials')
        })

        it('should throw a generic message on non-Error rejections', async () => {
            vi.mocked(api.post).mockRejectedValueOnce(null)

            await expect(
                login({ email: 'user@test.com', password: 'pass' }),
            ).rejects.toThrow('Login failed')
        })
    })
})
