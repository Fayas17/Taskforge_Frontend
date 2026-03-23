import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                // Test files
                'src/**/*.test.{ts,tsx}',
                'src/test/**',
                // Entry points and declarations
                'src/main.tsx',
                'src/App.tsx',
                'src/vite-env.d.ts',
                // Type-only files — no executable logic
                'src/**/*.types.ts',
                // Pure re-exports and constant definitions — nothing to assert
                'src/hooks/useAuth.ts',
                'src/constants/**',
                // Declarative route config — no business logic
                'src/routes/index.tsx',
                // Layout and pure presentational components
                'src/layouts/**',
                'src/components/common/Hero.tsx',
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 70,
                statements: 70,
            },
        },
    },
})
