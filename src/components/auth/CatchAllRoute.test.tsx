import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import CatchAllRoute from './CatchAllRoute'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

describe('CatchAllRoute', () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    it('should redirect to dashboard if authenticated', () => {
        window.localStorage.setItem('isAuthenticated', 'true')

        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <Routes>
                    <Route path="/dashboard" element={<div>Dashboard</div>} />
                    <Route path="/unknown" element={<CatchAllRoute />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should redirect to home if NOT authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <Routes>
                    <Route path="/" element={<div>Home/Login</div>} />
                    <Route path="/unknown" element={<CatchAllRoute />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText('Home/Login')).toBeInTheDocument()
    })
})
