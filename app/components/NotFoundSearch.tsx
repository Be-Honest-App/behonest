"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundSearch() {
    const [q, setQ] = useState('');
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!q.trim()) return;
        // Navigate to home with tag query (feed supports `tag` / `industry` filters)
        router.push(`/?tag=${encodeURIComponent(q.trim())}`);
    };

    return (
        <form onSubmit={submit} className="mt-6 w-full max-w-md mx-auto md:mx-0">
            <label htmlFor="nf-search" className="sr-only">Search posts</label>
            <div className="relative flex items-center gap-2">
                <input
                    id="nf-search"
                    ref={inputRef}
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by tag or keyword..."
                    className="flex-1 px-4 py-3 pr-12 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />

                {/* Custom clear button inside input (orange '×') */}
                {q.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setQ('');
                            inputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                        className="absolute right-28 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 text-xl leading-none"
                    >
                        ×
                    </button>
                )}

                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold shadow-sm transition-colors duration-150"
                    aria-label="Search posts"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
