import axios from 'axios'
import { api } from './axios'

// To handle concurrent requests during a token refresh phase
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve()
        }
    })
    failedQueue = []
}

// Responses: Check for 401 and attempt automatic Cookie Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If error is 401 Unauthorized, and it's NOT the refresh endpoint itself or login endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('auth/refresh') &&
            !originalRequest.url?.includes('auth/login')
        ) {
            if (isRefreshing) {
                // If a refresh is already active, queue this failed request and wait
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then(() => {
                        // After refresh succeeds, retry natively (cookies auto-attach)
                        return api(originalRequest)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Background POST to refresh. Raw axios prevents interceptor loops.
                // `withCredentials: true` ensures the browser sends the refresh cookie,
                // and accepts the new Set-Cookie Header containing our new access cookie.
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}auth/refresh/`,
                    {},
                    { withCredentials: true },
                )

                // 1. Resolve queued failed requests
                processQueue(null)

                // 2. Retry the originally failed request. (The browser will auto-attach the new cookies!)
                return api(originalRequest)
            } catch (err) {
                // If the refresh token itself expired / is invalid, we process failures
                processQueue(err)

                // Clear the frontend's authentication UI flag
                localStorage.removeItem('isAuthenticated')

                // Dispatch event so AuthContext immediately clears user state
                // This lets React (GuestRoute/ProtectedRoute) handle redirects cleanly without a hard page reload!
                window.dispatchEvent(new Event('unauthorized'))

                return Promise.reject(err)
            } finally {
                // Open up the gate for future 401 retries
                isRefreshing = false
            }
        }

        // Return a cleaner error message if available
        let message = error.message || 'Something went wrong'

        if (error.response?.data) {
            const data = error.response.data
            if (typeof data === 'string') {
                message = data
            } else if (data.detail) {
                message = data.detail
            } else if (data.message) {
                message = data.message
            } else if (
                data.non_field_errors &&
                Array.isArray(data.non_field_errors)
            ) {
                message = data.non_field_errors[0]
            } else if (data.error && typeof data.error === 'string') {
                message = data.error
            } else if (
                typeof data === 'object' &&
                Object.keys(data).length > 0
            ) {
                // Fallback to the first array or string property in the object (common for Django field errors)
                const firstKey = Object.keys(data)[0]
                const firstVal = data[firstKey]
                if (
                    Array.isArray(firstVal) &&
                    typeof firstVal[0] === 'string'
                ) {
                    message = firstVal[0]
                } else if (typeof firstVal === 'string') {
                    message = firstVal
                }
            }
        }

        return Promise.reject(new Error(message))
    },
)
