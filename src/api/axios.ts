import axios from 'axios'

// Shared Axios instance used across the app.
// `withCredentials: true` is required for the browser to send and receive
// HttpOnly cookies on cross-origin requests to the backend.
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
