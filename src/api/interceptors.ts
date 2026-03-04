import { api } from './axios'

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong'

        return Promise.reject(new Error(message))
    },
)
