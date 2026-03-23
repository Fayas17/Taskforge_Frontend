import '@testing-library/jest-dom'
import { vi, expect } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import 'vitest-axe/extend-expect'

expect.extend(axeMatchers)

// Mock matchMedia for framer-motion or other libraries if needed
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString()
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key]
        }),
        clear: vi.fn(() => {
            store = {}
        }),
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})
