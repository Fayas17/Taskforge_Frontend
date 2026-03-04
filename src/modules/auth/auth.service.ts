import { api } from '@/api/axios'
import type { RegisterPayload, RegisterResponse } from './auth.types'

export const register = async (
    payload: RegisterPayload,
): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', payload)
    return response.data
}
