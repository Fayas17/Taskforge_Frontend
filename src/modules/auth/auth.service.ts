import { api } from '@/api/axios'
import type { RegisterPayload, LoginPayload, LoginResponse } from './auth.types'

export async function register(data: RegisterPayload) {
    try {
        const res = await api.post('auth/register/', data)
        return res.data
    } catch (error: unknown) {
        throw new Error(
            (error as { response?: { data?: { detail?: string } } }).response
                ?.data?.detail || 'Registration failed',
        )
    }
}

export async function login(data: LoginPayload) {
    try {
        const res = await api.post<LoginResponse>('auth/login/', data)
        return res.data
    } catch (error: unknown) {
        throw new Error(
            (error as { response?: { data?: { detail?: string } } }).response
                ?.data?.detail || 'Login failed',
        )
    }
}
