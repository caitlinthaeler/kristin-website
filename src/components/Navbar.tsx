'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_GROUPS = [
  {
    label: 'Work',
    items: [
      { label: 'Films', href: '/films', desc: 'Short films & features' },
      { label: 'Animations', href: '/animations', desc: 'Clips, gifs & animatics' },
      { label: 'Life Drawings', href: '/life-drawings', desc: 'Figure & observational work' },
      { label: 'Gallery', href: '/gallery', desc: 'Browse all works' },
      { label: 'Instagram', href: '/instagram', desc: '@firresketches' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Me', href: '/about', desc: 'Bio, contact & resume' },
      { label: 'Skills', href: '/skills', desc: 'Software, education & experience' },
    ],
  },
  {
    label: 'Hire',
    items: [
      { label: 'Services', href: '/services', desc: 'Commission & freelance' },
      { label: 'Contact', href: '/about#contact', desc: 'Send a message' },
    ],
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass"
      onMouseLeave={() => setOpen(null)}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group flex flex-col leading-none gap-0.5">
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Kristin Thaeler
          </span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-muted group-hover:text-secondary transition-colors duration-200">
            firresketches
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_GROUPS.map((group) => (
            <li key={group.label} className="relative">
              <button
                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 flex items-center gap-1.5 ${
                  open === group.label
                    ? 'text-foreground bg-surface'
                    : 'text-muted hover:text-foreground hover:bg-surface/60'
                }`}
                onMouseEnter={() => setOpen(group.label)}
              >
                {group.label}
                <motion.svg
                  animate={{ rotate: open === group.label ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3 h-3"
                  fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {open === group.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 min-w-[200px]"
                  >
                    {/* ember top line */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mb-0 rounded-t-lg" />
                    <ul className="bg-hollow border border-veil/60 rounded-xl overflow-hidden shadow-2xl shadow-black/60 py-1">
                      {group.items.map((item, i) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.15 }}
                        >
                          <Link
                            href={item.href}
                            className={`flex flex-col px-4 py-2.5 hover:bg-shade transition-colors ${
                              pathname === item.href ? 'text-primary' : 'text-foreground'
                            }`}
                            onClick={() => setOpen(null)}
                          >
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-[11px] text-muted mt-0.5">{item.desc}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/services"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors duration-150 border border-primary/20"
        >
          Hire Me
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-foreground p-1.5 rounded-lg hover:bg-surface transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.div animate={mobileOpen ? 'open' : 'closed'} className="flex flex-col gap-1.5 w-5">
            <motion.span
              variants={{ open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } }}
              className="block h-px bg-current origin-center"
            />
            <motion.span
              variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
              className="block h-px bg-current"
            />
            <motion.span
              variants={{ open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } }}
              className="block h-px bg-current origin-center"
            />
          </motion.div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="px-6 py-5 bg-hollow space-y-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary mb-2">{group.label}</p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block py-2 px-3 rounded-lg text-sm transition-colors hover:bg-shade ${
                            pathname === item.href ? 'text-primary' : 'text-foreground'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
