// components/LoadingScreen.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ count = 5 }: { count?: number }) {
    return (
        <AnimatePresence>
            <div className="space-y-5 animate-pulse">
                {Array.from({ length: count }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }} // Staggered animation
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                    >
                        {/* Fake Header: Tag + Time */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                        </div>

                        {/* Fake Content: Truncated text */}
                        <div className="space-y-3 mb-4">
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                        </div>

                        {/* Fake Actions: Like + Share */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-6">
                                {/* Pulsing Heart */}
                                <motion.div
                                    className="flex items-center space-x-1 text-gray-400"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                >
                                    <div className="w-4 h-4 bg-gradient-to-r from-red-200 to-red-300 rounded-full animate-pulse"></div>
                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-6"></div>
                                </motion.div>
                                {/* Share */}
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-gradient-to-r from-blue-200 to-blue-300 rounded animate-pulse"></div>
                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-6"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    );
}