import Link from 'next/link';
import NotFoundSearch from './components/NotFoundSearch';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-orange-50 to-orange-100 px-4 sm:px-6">
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-10">

                {/* Icon */}
                <section className="flex-shrink-0">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto md:mx-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M11 7h2v6h-2z" fill="white" />
                            <path d="M11 15h2v2h-2z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM3.5 12a8.5 8.5 0 1117 0 8.5 8.5 0 01-17 0z" fill="rgba(255,255,255,0.9)" />
                        </svg>
                    </div>
                </section>

                {/* Text + Search */}
                <section className="flex-1 text-center md:text-left">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-orange-600 mb-2 sm:mb-4">404</h1>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-slate-700 leading-snug">
                        We couldn&apos;t find that page
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-full sm:max-w-lg">
                        The page you are looking for may have been removed, had its name changed, or is temporarily unavailable. Don&apos;t worry, the rest of BeHonest is still here.
                    </p>

                    <NotFoundSearch />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 mt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md transition-shadow duration-200 text-sm sm:text-base w-full sm:w-auto text-center"
                        >
                            Go home
                        </Link>

                        {/* Optional: Contact button */}
                        {/* <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto text-center"
                        >
                            Contact support
                        </Link> */}
                    </div>

                    <div className="mt-3 text-xs sm:text-sm text-slate-400 max-w-full sm:max-w-md">
                        Tip: Try checking your URL or search by tag above to filter the feed.
                    </div>
                </section>
            </div>
        </main>
    );
}

