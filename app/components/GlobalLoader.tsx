'use client';

import { motion } from 'framer-motion';

export default function GlobalLoader() {
    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div className="flex flex-col items-center space-y-4 text-center">
                {/* Logo Container */}
                <motion.div
                    className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-6 py-4 rounded-full shadow-lg flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Letter B */}
                    <motion.span
                        className="text-xl"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 120 }}
                    >
                        B
                    </motion.span>
                    {/* Letter H */}
                    <motion.span
                        className="text-xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 120 }}
                    >
                        H
                    </motion.span>
                </motion.div>

                {/* Loading Text */}
                <motion.p
                    className="text-gray-500 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                >
                    Loading BeHonest...
                </motion.p>
            </motion.div>
        </motion.div>
    );
}
