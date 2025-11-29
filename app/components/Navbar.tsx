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
    <header className="px-6 md:px-20 pb-2 rounded-xl pt-5 fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md transition-opacity duration-300 ease-in-out">
      {/* Header Container */}
      <div className="flex items-center justify-between">
        {/* Logo + Title */}
        <Link href="/">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold px-4 py-3 rounded-lg inline-block">
              BH
            </div>

            <div>
              <h1 className="text-2xl font-semibold">BeHonest</h1>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${pathname === item.href
                ? 'text-orange-400 font-semibold'
                : 'text-orange-500'
                } hover:text-orange-400 transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header >
  )
}