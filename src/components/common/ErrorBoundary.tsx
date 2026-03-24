import React from 'react'

type Props = {
    children: React.ReactNode
}

type State = {
    hasError: boolean
}

// Catches unhandled React render errors and shows a fallback UI instead of
// a blank screen. Wrap top-level providers in main.tsx with this.
// To report to an error monitoring service, add Sentry.captureException()
// inside componentDidCatch() when that's set up.
class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-red-500 text-xl">
                        Something went wrong.
                    </h1>
                </div>
            )
        }

        return this.props.children
    }
}
export default ErrorBoundary
