import { api } from '@/api/axios'
import type { RegisterPayload } from './auth.types'

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
