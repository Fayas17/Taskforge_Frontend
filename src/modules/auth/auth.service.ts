import { api } from '@/api/axios'
import type { RegisterPayload, LoginPayload, LoginResponse } from './auth.types'

export async function register(data: RegisterPayload) {
    try {
        const res = await api.post('auth/register/', data)
        return res.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Registration failed')
        }
        throw new Error('Registration failed')
    }
}

export async function login(data: LoginPayload) {
    try {
        const res = await api.post<LoginResponse>('auth/login/', data)
        return res.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Login failed')
        }
        throw new Error('Login failed')
    }
}
