import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { api } from './axios'
import './interceptors'

const mock = new MockAdapter(api)
const axiosMock = new MockAdapter(axios)

describe('Axios Interceptors', () => {
    beforeEach(() => {
        mock.reset()
        axiosMock.reset()
        window.localStorage.clear()
        vi.clearAllMocks()
    })

    describe('Error message extraction', () => {
        it('should extract message from data.detail', async () => {
            mock.onGet('/test').reply(400, { detail: 'Detail error' })

            await expect(api.get('/test')).rejects.toThrow('Detail error')
        })

        it('should extract message from data.message', async () => {
            mock.onGet('/test').reply(400, { message: 'Message error' })

            await expect(api.get('/test')).rejects.toThrow('Message error')
        })

        it('should extract message from data.non_field_errors array', async () => {
            mock.onGet('/test').reply(400, {
                non_field_errors: ['Non field error'],
            })

            await expect(api.get('/test')).rejects.toThrow('Non field error')
        })

        it('should extract first field error from Django field errors object', async () => {
            mock.onGet('/test').reply(400, { email: ['Email is required'] })

            await expect(api.get('/test')).rejects.toThrow('Email is required')
        })

        it('should extract message from data.error string', async () => {
            mock.onGet('/test').reply(400, { error: 'Error string' })

            await expect(api.get('/test')).rejects.toThrow('Error string')
        })

        it('should use error.message as fallback when no response data', async () => {
            mock.onGet('/test').networkError()

            await expect(api.get('/test')).rejects.toThrow()
        })
    })

    describe('401 handling — token refresh', () => {
        it('should dispatch "unauthorized" event when refresh fails', async () => {
            const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

            mock.onGet('/protected').reply(401)
            axiosMock.onPost(/auth\/refresh/).reply(401)

            await expect(api.get('/protected')).rejects.toThrow()

            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'unauthorized' }),
            )
        })

        it('should clear localStorage when refresh fails', async () => {
            window.localStorage.setItem('isAuthenticated', 'true')

            mock.onGet('/protected').reply(401)
            axiosMock.onPost(/auth\/refresh/).reply(401)

            await expect(api.get('/protected')).rejects.toThrow()

            expect(window.localStorage.removeItem).toHaveBeenCalledWith(
                'isAuthenticated',
            )
        })

        it('should not attempt refresh for login endpoint 401s', async () => {
            const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
            mock.onPost('/auth/login').reply(401, { detail: 'Bad credentials' })

            await expect(api.post('/auth/login', {})).rejects.toThrow(
                'Bad credentials',
            )

            expect(dispatchSpy).not.toHaveBeenCalled()
        })

        it('should not attempt refresh for refresh endpoint 401s', async () => {
            const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
            mock.onPost('/auth/refresh').reply(401, {
                detail: 'Refresh token expired',
            })

            await expect(api.post('/auth/refresh', {})).rejects.toThrow()

            expect(dispatchSpy).not.toHaveBeenCalled()
        })
    })
})
