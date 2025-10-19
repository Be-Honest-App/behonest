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
  ]

  return (
    <header className="flex items-center justify-between gap-3 px-2 md:px-5 pt-5 md:pt-0">
      <div className="brand flex items-center gap-3 mx-2 md:mx-5">
        <div className="logo w-14 h-14 md:w-[56px] md:h-[56px] rounded-xl bg-fun-grad flex items-center justify-center font-extrabold text-white px-5 md:px-0 text-sm md:text-base">
          BH
        </div>
        <div>
          <h1 className="m-0 text-base md:text-lg font-bold">Be Honest</h1>
          <p className="tag text-muted text-xs">Say it honestly. Stay anonymous.</p>
        </div>
      </div>
      <nav className="flex items-center gap-2 md:gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-muted font-semibold bg-transparent hover:bg-glass transition-colors ${pathname === item.href ? 'bg-glass text-text' : ''
              }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          className="theme-toggle p-2 rounded-lg border border-glass hover:bg-glass transition-colors mx-5 md:mx-20"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}