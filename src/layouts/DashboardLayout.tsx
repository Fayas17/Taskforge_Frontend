import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { logoutUser } from '@/modules/dashboard/dashboard.service'

export default function DashboardLayout() {
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = async () => {
        await logoutUser()
        navigate('/')
    }

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                backgroundColor: '#fafaf9',
            }}
        >
            {/* Sidebar - Green */}
            <aside
                style={{
                    width: '250px',
                    backgroundColor: '#15803d',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        padding: '1.5rem',
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        letterSpacing: '-0.5px',
                    }}
                >
                    <span
                        className="auth-star-logo"
                        style={{ fontSize: '1.2rem', marginRight: '8px' }}
                    >
                        ✳
                    </span>
                    TaskForge
                </div>

                <nav
                    style={{
                        flex: 1,
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <button
                        style={{
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: 'white',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        style={{
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            background: 'transparent',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Projects
                    </button>
                    <button
                        style={{
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            background: 'transparent',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Tasks
                    </button>
                </nav>

                <div style={{ padding: '1rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Navbar - Black */}
                <header
                    style={{
                        height: '70px',
                        backgroundColor: '#111827',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '0 2rem',
                        gap: '1rem',
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#4b5563',
                                border: '2px solid #6b7280',
                                color: 'white',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            U
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '50px',
                                        background: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow:
                                            '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        width: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        zIndex: 50,
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '1rem',
                                            borderBottom: '1px solid #f3f4f6',
                                            color: '#111827',
                                        }}
                                    >
                                        <div style={{ fontWeight: 600 }}>
                                            Test User
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.8rem',
                                                color: '#6b7280',
                                            }}
                                        >
                                            test@taskforge.com
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontWeight: 600,
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            width: '100%',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                '#fef2f2')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                'transparent')
                                        }
                                    >
                                        Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
