import { Outlet } from 'react-router-dom'
import Hero from '@/components/common/hero'

export default function MainLayout() {
    return (
        <div>
            {/* This will show on all child routes */}
            <Hero />

            {/* This renders RegisterPage, LoginPage, etc */}
            <Outlet />
        </div>
    )
}
