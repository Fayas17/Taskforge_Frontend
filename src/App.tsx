import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 200)
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            {loading ? (
                <Skeleton count={1} width={200} height={40} />
            ) : (
                <h1 className="text-4xl font-bold">Taskforge</h1>
            )}
        </div>
    )
}

export default App
