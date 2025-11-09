'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/' },
    // { label: 'ShoutLink', href: '/shout' },
    // { label: 'Business', href: '/business' },
    // { label: 'Contact', href: '/contact' },
  ]

  const letterVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 120, damping: 12 } },
  } as const // Fixed: 'as const' prevents type widening to 'string'

  const textVariant = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.6 } },
  } as const // Fixed: 'as const' for consistency (no spring, but safe)

  return (
    <header className="mx-2 pb-2 rounded-xl pt-5 px-5 md:mx-2 md:sticky md:top-0 z-50 bg-white backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        {/* Animated Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex items-center space-x-2"
          >
            {/* Gradient Background Block */}
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-4 py-3 rounded-lg shadow-lg flex items-center justify-center" // Fixed: Removed 'inline-block' (conflicts with 'flex')
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" as const, stiffness: 120, damping: 12, duration: 0.8 }} // Fixed: 'as const' for literal type
            >
              {/* B */}
              <motion.span
                variants={letterVariant}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                B
              </motion.span>
              {/* H */}
              <motion.span
                variants={letterVariant}
                transition={{ delay: 0.4 }}
                className="inline-block"
              >
                H
              </motion.span>
            </motion.div>

            {/* BeHonest Text */}
            <motion.div
              variants={textVariant}
              className="text-2xl font-semibold"
            >
              BeHonest
            </motion.div>
          </motion.div>
        </Link>

        {/* Nav Links */}
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${pathname === item.href
                ? 'text-orange-500 font-semibold'
                : 'text-gray-700'
                } hover:text-orange-400 transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}