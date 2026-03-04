export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in">
                Task<span className="text-indigo-500">Forge</span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl text-center animate-slide-up">
                Organize. Focus. Achieve. Your productivity companion built for
                clarity and speed.
            </p>

            <div className="mt-10 animate-bounce-slow">
                <button className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl shadow-lg">
                    Get Started
                </button>
            </div>
        </section>
    )
}
