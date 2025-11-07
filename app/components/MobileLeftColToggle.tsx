// components/MobileLeftColToggle.tsx (New client component)
'use client';

import { useState } from 'react';
import LeftCol from './LeftCol'; // Import your LeftCol (default export)

export function MobileLeftColToggle() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleLeftCol = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Floating + button on mobile */}
            <button
                onClick={toggleLeftCol}
                className="fixed bottom-14 right-4 z-50 w-24 h-24 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-5xl font-bold md:hidden focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Open compose"
            >
                +
            </button>

            {/* Full-screen overlay modal on mobile (Twitter-like compose sheet) */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden flex items-end justify-center p-0">
                    <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative -mb-10">
                        <div className="p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 bg-white z-15">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-4 py-3 rounded-lg inline-block">
                                BH
                            </div>
                            <button
                                onClick={toggleLeftCol}
                                className="text-gray-500 hover:text-gray-700 text-4xl p-1"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <LeftCol />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}