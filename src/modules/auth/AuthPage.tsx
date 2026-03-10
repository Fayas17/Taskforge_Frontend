import { useState } from 'react'
import { login } from './auth.service'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

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

// stagger = each child fades in 0.1s after the previous one
const stagger = {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
}
const item = {
    initial: { opacity: 0, y: 14 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' as const },
    },
}

import { useAuth } from '@/context/auth-context'

export default function AuthPage() {
    const navigate = useNavigate()
    const { setIsAuthenticated } = useAuth()

    // useState — holds values that change over time and trigger re-renders
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // stops browser from refreshing the page
        setError(null)
        if (!email || !password) {
            setError('Please fill in both fields.')
            return
        }
        setLoading(true)
        try {
            const data = await login({ email, password })

            // A 200 HTTP response establishes the security cookies; just set frontend state
            if (data) {
                localStorage.setItem('isAuthenticated', 'true')
                setIsAuthenticated(true)
            }

            // Redirect
            navigate('/dashboard')
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : 'Something went wrong.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        /*
  The outer div is the full screen container.
  display:flex makes children sit side by side (left & right).
  height:100vh = exactly the viewport height — no scrolling.
  overflow:hidden = clips anything that spills out.
*/
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
                {/* Subtle grid texture */}
                <div className="auth-grid-overlay" />

                {/* Diagonal rectangle decorations — same style as the SaleSkip image */}
                <div className="auth-diag-lines">
                    <div className="auth-diag-rect auth-diag-rect-1" />
                    <div className="auth-diag-rect auth-diag-rect-2" />
                    <div className="auth-diag-rect auth-diag-rect-3" />
                </div>

                {/* TOP: Asterisk logo */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <span className="auth-star-logo">✳</span>
                </div>

                {/* MIDDLE: Headline + subtitle */}
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
                        Hello
                        <br />
                        TaskForge! 👋
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
                        }}
                    >
                        Organize tasks smarter, track progress faster. Build
                        powerful productivity habits and get more done — every
                        day.
                    </motion.p>
                </div>

                {/* BOTTOM: Copyright */}
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
          RIGHT PANEL  ·  40%  ·  Off-white login form
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
                    overflow: 'hidden', // prevents any scroll — everything must fit
                }}
            >
                {/* Brand name at the top */}
                <div>
                    <span className="auth-brand-name">TaskForge</span>
                </div>

                {/*
          motion.div with stagger:
          When this mounts, each child animates in 0.1s after the previous.
          This creates a smooth "cascade" effect on the form elements.
        */}
                <motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.4rem',
                    }}
                >
                    {/* Heading row */}
                    <motion.div variants={item}>
                        <h2
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                color: '#111827',
                                marginBottom: '0.3rem',
                            }}
                        >
                            Welcome Back!
                        </h2>
                        <p
                            style={{
                                fontSize: '0.8rem',
                                color: '#6b7280',
                                lineHeight: 1.55,
                            }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: '#15803d',
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                }}
                            >
                                Create a new account now
                            </Link>
                            , it&apos;s FREE! Takes less than a minute.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        variants={item}
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {/*
              Underline input — no box border, just a bottom line.
              className="auth-input-underline" applies the style from index.css.
            */}
                        <input
                            id="login-email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input-underline"
                            autoComplete="email"
                        />

                        <input
                            id="login-password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input-underline"
                            autoComplete="current-password"
                        />

                        {/* Error — only shows if error is not null */}
                        {error && <div className="auth-error">{error}</div>}

                        {/* Dark "Login Now" button */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="auth-btn-dark"
                        >
                            {loading ? 'Logging in…' : 'Login Now'}
                        </button>
                    </motion.form>

                    {/* Google login */}
                    <motion.div variants={item}>
                        <button
                            id="login-google"
                            type="button"
                            className="auth-btn-google"
                            onClick={() => {
                                window.location.href = `${import.meta.env.VITE_API_BASE_URL}auth/google/login/`
                            }}
                        >
                            {/* Google "G" logo as inline SVG — no image file needed */}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                            >
                                <path
                                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Login with Google
                        </button>
                    </motion.div>

                    {/* Forgot password */}
                    <motion.p
                        variants={item}
                        style={{
                            textAlign: 'center',
                            fontSize: '0.82rem',
                            color: '#9ca3af',
                        }}
                    >
                        Forget password?{' '}
                        <a
                            href="#"
                            style={{ color: '#111827', fontWeight: 600 }}
                        >
                            Click here
                        </a>
                    </motion.p>
                </motion.div>

                {/* Spacer */}
                <div />
            </motion.div>
        </div>
    )
}
