import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { register } from './auth.service'
import type { RegisterPayload } from './auth.types'
import ErrorBoundary from '@/components/common/ErrorBoundary'

// ─── Animation variants ────────────────────────────────────────
const leftVariant = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
}
const rightVariant = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
}
const stagger = {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const item = {
    initial: { opacity: 0, y: 12 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
}

export default function RegisterPage() {
    /*
     * useState<RegisterPayload> — stores all 4 form fields in one object.
     * When a field changes, we "spread" (...) the old values to keep them,
     * then override only the changed field using [e.target.name].
     */
    const [form, setForm] = useState<RegisterPayload>({
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // One handler for ALL inputs — e.target.name matches the RegisterPayload key
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault() // stop page refresh
        setError(null)
        setSuccess(false)
        if (form.password !== form.confirmpassword) {
            setError('Passwords do not match.')
            return
        }
        try {
            setLoading(true)
            await register(form) // calls auth.service.ts → your Django backend
            setSuccess(true)
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : 'Something went wrong.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <ErrorBoundary>
            {/*
        height:100vh = exactly the viewport height.
        overflow:hidden = nothing spills outside.
        display:flex = puts left and right panels side by side.
      */}
            <div
                style={{
                    display: 'flex',
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden',
                }}
            >
                {/* ══════════════════════════════════════════════════════
            LEFT PANEL  ·  60%  ·  Green brand section
        ══════════════════════════════════════════════════════ */}
                <motion.div
                    {...leftVariant}
                    className="auth-hero-panel"
                    style={{
                        width: '60%',
                        minWidth: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '2.5rem 3rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div className="auth-grid-overlay" />
                    <div className="auth-diag-lines">
                        <div className="auth-diag-rect auth-diag-rect-1" />
                        <div className="auth-diag-rect auth-diag-rect-2" />
                        <div className="auth-diag-rect auth-diag-rect-3" />
                    </div>

                    {/* Logo */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <span className="auth-star-logo">✳</span>
                    </div>

                    {/* Headline + subtitle */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                            style={{
                                fontSize: '3.8rem',
                                fontWeight: 900,
                                color: 'white',
                                lineHeight: 1.1,
                                letterSpacing: '-1px',
                                marginBottom: '1rem',
                            }}
                        >
                            Join
                            <br />
                            TaskForge! 🚀
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.58, duration: 0.65 }}
                            style={{
                                color: 'rgba(220,252,231,0.9)',
                                fontSize: '1rem',
                                lineHeight: 1.65,
                                maxWidth: '380px',
                                marginBottom: '1.4rem',
                            }}
                        >
                            Create your free account in seconds. Start turning
                            your goals into completed tasks — today.
                        </motion.p>

                        {/* 3-step guide */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.78, duration: 0.6 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.65rem',
                            }}
                        >
                            {[
                                { n: '1', label: 'Create your account' },
                                { n: '2', label: 'Set up your workspace' },
                                { n: '3', label: 'Start tracking tasks' },
                            ].map(({ n, label }) => (
                                <div
                                    key={n}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.65rem',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            flexShrink: 0,
                                            background:
                                                'rgba(255,255,255,0.18)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {n}
                                    </span>
                                    <span
                                        style={{
                                            color: 'rgba(220,252,231,0.85)',
                                            fontSize: '0.88rem',
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Copyright */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <p
                            style={{
                                color: 'rgba(187,247,208,0.7)',
                                fontSize: '0.82rem',
                            }}
                        >
                            © 2026 TaskForge. All rights reserved.
                        </p>
                    </div>
                </motion.div>

                {/* ══════════════════════════════════════════════════════
            RIGHT PANEL  ·  40%  ·  Off-white registration form
        ══════════════════════════════════════════════════════ */}
                <motion.div
                    {...rightVariant}
                    className="auth-right-panel"
                    style={{
                        width: '40%',
                        minWidth: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '2.5rem 3.5rem',
                        overflow: 'hidden', // everything MUST fit — no scroll
                    }}
                >
                    {/* Brand name at top */}
                    <div>
                        <span className="auth-brand-name">TaskForge</span>
                    </div>

                    {/* Stagger-animated form */}
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.1rem',
                        }}
                    >
                        {/* Heading */}
                        <motion.div variants={item}>
                            <h2
                                style={{
                                    fontSize: '1.65rem',
                                    fontWeight: 800,
                                    color: '#111827',
                                    marginBottom: '0.3rem',
                                }}
                            >
                                Create Account
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                Already have an account?{' '}
                                <Link
                                    to="/"
                                    style={{
                                        color: '#15803d',
                                        fontWeight: 600,
                                        textDecoration: 'underline',
                                    }}
                                >
                                    Sign in →
                                </Link>
                            </p>
                        </motion.div>

                        {/* Success banner */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="auth-success"
                            >
                                🎉 Account created!{' '}
                                <Link
                                    to="/"
                                    style={{
                                        fontWeight: 700,
                                        textDecoration: 'underline',
                                    }}
                                >
                                    Sign in
                                </Link>
                                .
                            </motion.div>
                        )}

                        {/* Form inputs */}
                        <motion.form
                            variants={item}
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.9rem',
                            }}
                        >
                            {/*
                name="username" → must match the key in RegisterPayload
                value={form.username} → controlled: React owns the displayed value
                onChange={handleChange} → updates state on every keystroke
              */}
                            <input
                                id="reg-username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                                value={form.username}
                                onChange={handleChange}
                                className="auth-input-underline"
                                autoComplete="username"
                            />
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="auth-input-underline"
                                autoComplete="email"
                            />
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="auth-input-underline"
                                autoComplete="new-password"
                            />
                            <input
                                id="reg-confirmpassword"
                                name="confirmpassword"
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={form.confirmpassword}
                                onChange={handleChange}
                                className="auth-input-underline"
                                autoComplete="new-password"
                            />

                            {error && <div className="auth-error">{error}</div>}

                            <button
                                id="reg-submit"
                                type="submit"
                                disabled={loading || success}
                                className="auth-btn-dark"
                            >
                                {loading
                                    ? 'Creating account…'
                                    : 'Create Account'}
                            </button>
                        </motion.form>

                        {/* Terms */}
                        <motion.p
                            variants={item}
                            style={{
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                                lineHeight: 1.6,
                            }}
                        >
                            By registering you agree to our{' '}
                            <a href="#" style={{ color: '#15803d' }}>
                                Terms
                            </a>{' '}
                            &amp;{' '}
                            <a href="#" style={{ color: '#15803d' }}>
                                Privacy Policy
                            </a>
                            .
                        </motion.p>
                    </motion.div>

                    <div />
                </motion.div>
            </div>
        </ErrorBoundary>
    )
}
