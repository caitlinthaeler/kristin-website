'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  {
    label: 'Work',
    items: [
      { label: 'Films', href: '/films' },
      { label: 'Animations', href: '/animations' },
      { label: 'Life Drawings', href: '/life-drawings' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Instagram', href: '/instagram' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Me', href: '/about' },
      { label: 'Skills & Achievements', href: '/skills' },
    ],
  },
  {
    label: 'Hire',
    items: [
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/about#contact' },
    ],
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-primary transition-colors">
          Kristin Thaeler
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((group) => (
            <li
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(group.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="text-sm text-muted-text hover:text-foreground transition-colors py-2 flex items-center gap-1">
                {group.label}
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openMenu === group.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <ul className="bg-surface border border-border rounded-lg overflow-hidden min-w-[160px] shadow-xl">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block px-4 py-2.5 text-sm hover:bg-surface-elevated transition-colors ${
                            pathname === item.href ? 'text-primary' : 'text-foreground'
                          }`}
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted-text hover:text-foreground"
          onClick={() => setOpenMenu(openMenu ? null : 'mobile')}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {openMenu === 'mobile' && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-4">
          {NAV_ITEMS.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-xs text-muted-text uppercase tracking-widest mb-2">{group.label}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block py-1.5 text-sm ${
                        pathname === item.href ? 'text-primary' : 'text-foreground'
                      }`}
                      onClick={() => setOpenMenu(null)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
