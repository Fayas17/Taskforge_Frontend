import { useEffect, useState } from 'react'
import { getCurrentUser } from './dashboard.service'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    const [user, setUser] = useState<{ name: string; email: string } | null>(
        null,
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                maxWidth: '800px',
            }}
        >
            <h1
                style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#111827',
                    marginBottom: '1rem',
                    letterSpacing: '-0.5px',
                }}
            >
                Dashboard
            </h1>

            {loading ? (
                <div style={{ padding: '2rem 0', color: '#6b7280' }}>
                    Loading user data... (/me)
                </div>
            ) : error ? (
                <div
                    style={{
                        padding: '1rem',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '6px',
                        fontWeight: 500,
                    }}
                >
                    Failed to load user: {error}
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>
                        Welcome back,{' '}
                        <strong style={{ color: '#111827' }}>
                            {user?.name}
                        </strong>
                        !
                    </p>
                    <p style={{ color: '#6b7280' }}>Email: {user?.email}</p>

                    <div
                        style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            border: '1px dashed #d1d5db',
                            borderRadius: '8px',
                            background: '#f9fafb',
                        }}
                    >
                        <h3
                            style={{
                                fontWeight: 700,
                                color: '#374151',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Next Steps
                        </h3>
                        <ul
                            style={{
                                paddingLeft: '1.5rem',
                                color: '#4b5563',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            <li>Wire up real backend endpoints.</li>
                            <li>Implement actual `auth.service.ts` logic.</li>
                            <li>Add feature sections to the sidebar.</li>
                        </ul>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
