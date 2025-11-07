'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'


export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/' },
    // { label: 'ShoutLink', href: '/shout' },
    // { label: 'Business', href: '/business' },
    // { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="mx-2 pb-2 rounded-xl pt-5 px-5 md:mx-2 md:sticky md:top-0 z-50 bg-white backdrop-blur-md transition-opacity duration-300 ease-in-out">
      {/* Header Container */}
      <div className="flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-4 py-3 rounded-lg inline-block">
            BH
          </div>

          <div>
            <h1 className="text-2xl font-semibold">BeHonest</h1>
          </div>
        </div>

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