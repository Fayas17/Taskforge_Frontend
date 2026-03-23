import { api } from '@/api/axios'

export async function getCurrentUser() {
    // Relying fully on Django HttpOnly cookies holding our credentials naturally
    const res = await api.get('/auth/me/')
    return res.data
}

export async function refreshToken() {
    // Hit refresh endpoint. The backend processes the HttpOnly refresh token
    // from cookies and attaches a newly signed access cookie to the HTTP response.
    const res = await api.post('auth/refresh/')
    return res.data
}

export async function logoutUser() {
    try {
        // Hit logout endpoint. Backend adds Set-Cookie headers targeting `access`
        // and `refresh` with an expiry date in the past, obliterating them.
        await api.post('auth/logout/')
    } catch {
        // Logout failure is non-critical — server cookies expire naturally
    } finally {
        // Always scrub frontend authentication status regardless of server response
        localStorage.removeItem('isAuthenticated')
    }
}
