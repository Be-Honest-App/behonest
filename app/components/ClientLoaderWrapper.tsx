// components/ClientLoaderWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GlobalLoader from './GlobalLoader';

export default function ClientLoaderWrapper({ children }: { children: React.ReactNode }) {
    const [isGlobalLoading, setIsGlobalLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsGlobalLoading(false), 3000); // Minimum 5s loader
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isGlobalLoading && <GlobalLoader key="loader" />}
            </AnimatePresence>
            {children}
        </>
    );
}
