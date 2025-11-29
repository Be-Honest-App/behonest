'use client';

import { useState, useEffect, useRef } from 'react';
import LeftCol from './LeftCol';

export function MobileLeftColToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const toggleLeftCol = () => setIsOpen(!isOpen);

    useEffect(() => {
        let ticking = false;
        const threshold = 10;

        const handleScroll = () => {
            const currentY = window.scrollY || 0;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const delta = currentY - lastScrollY.current;

                    if (currentY <= 50) {
                        setIsVisible(true);
                    } else if (delta > threshold) {
                        setIsVisible(false);
                    } else if (delta < -threshold) {
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
            {/* Floating button */}
            <button
                onClick={toggleLeftCol}
                className={`fixed bottom-16 right-4 z-50 w-14 h-14 md:w-20 md:h-20 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-5xl font-bold md:hidden focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''} ${effectiveVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
                aria-label={isOpen ? 'Close compose' : 'Open compose'}
            >
                <span className="pointer-events-none -mt-2 md:-mt-2">+</span>
            </button>


        
            {/* Mobile modal */}
            {isOpen && (
                <div className="fixed inset-x-0 top-40 bottom-0 z-40 md:hidden flex items-start justify-center p-0 border border-orange-300/70 ">
                    <div className="bg-white w-full rounded-t-2xl max-h-[calc(90vh-4rem)] h-[90vh] overflow-y-auto shadow-2xl relative pb-safe">
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-white sticky top-0 z-30">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-4 py-3 rounded-lg">
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

                        {/* Content */}
                        <div className="p-4">
                            <LeftCol />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
