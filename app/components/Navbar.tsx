'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isDark = theme === 'dark'

  const navItems = [
    { label: 'Home', href: '/' },
    //   { label: 'ShoutLink', href: '/shout' },
    //   { label: 'Business', href: '/business' },
    //   { label: 'Contact', href: '/contact' },
  ]

  return (
    <header>
      <div className="brand mx-2 pt-5 md:mx-20">
        <div className="logo px-5">BH</div>
        <div>
          <h1>Be Honest</h1>
          <div className="tag muted">Say it honestly. Stay anonymous.</div>
        </div>
      </div>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={` ${pathname === item.href ? 'active' : ''} `}
          >
            {item.label}
          </Link>
        ))}
        <button
          className="theme-toggle mx-20"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}