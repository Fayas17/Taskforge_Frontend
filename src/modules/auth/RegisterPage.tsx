import { useState } from 'react'
import { register } from './auth.service'
import type { RegisterPayload } from './auth.types'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterPayload>({
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (form.password !== form.confirmpassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await register(form)
            alert('Registration successful! Please login.')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <ErrorBoundary>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Create Account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="username"
                            type="username"
                            placeholder="Username"
                            required
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        <input
                            name="confirmpassword"
                            type="password"
                            placeholder="Confirm Password"
                            required
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    {error && (
                        <p className="text-red-500 mt-4 te   xt-center">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    )
}
