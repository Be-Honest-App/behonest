// components/MobileLeftColToggle.tsx (New client component)
'use client';

import { useState, useEffect, useRef } from 'react';
import LeftCol from './LeftCol'; // Import your LeftCol (default export)

export function MobileLeftColToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // visibility controlled by scroll direction
    const lastScrollY = useRef(0);

    const toggleLeftCol = () => setIsOpen(!isOpen);

    useEffect(() => {
        let ticking = false;
        const threshold = 10; // minimum delta to trigger direction change

        const handleScroll = () => {
            const currentY = window.scrollY || 0;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const delta = currentY - lastScrollY.current;

                    // Always show at the top
                    if (currentY <= 50) {
                        setIsVisible(true);
                    } else if (delta > threshold) {
                        // scrolling down -> hide
                        setIsVisible(false);
                    } else if (delta < -threshold) {
                        // scrolling up -> show
                        setIsVisible(true);
                    }

                    lastScrollY.current = currentY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Listen to feed internal scroll events to hide/show button
    useEffect(() => {
        const handler = (e: Event) => {
            const ev = e as CustomEvent<{ visible: boolean }>;
            const visible = ev?.detail?.visible;
            if (typeof visible === 'boolean') setIsVisible(visible);
        };

        window.addEventListener('feed-scroll', handler as EventListener);
        return () => window.removeEventListener('feed-scroll', handler as EventListener);
    }, []);

    const effectiveVisible = isOpen || isVisible;

    return (
        <>
            {/* Floating + button on mobile */}
            <button
                onClick={toggleLeftCol}
                className={`fixed bottom-14 w-14 h-14 md:w-20 md:h-20 right-2 z-50 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-5xl font-bold md:hidden focus:outline-none focus:ring-2 focus:ring-orange-300 hover:cursor-pointer transform transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 bg-orange-500' : 'hover:bg-orange-300'} ${effectiveVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
                aria-label={isOpen ? 'Close compose' : 'Open compose'}
            >
                <span className="pointer-events-none">×</span>
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
                        <div className="p-4 transition-transform duration-300 ease-in-out">
                            <LeftCol />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}