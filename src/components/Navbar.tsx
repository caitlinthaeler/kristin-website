'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const NAV = [
  { label: 'Animations', href: '/animations' },
  { label: 'Films',      href: '/films' },
  { label: 'Personal',   href: '/personal' },
  { label: 'About Me',   href: '/about' },
]

type ImagePanel = {
  type: 'image'
  image: string
  sub: string
  links: { label: string; href: string }[]
}
type CardsPanel = {
  type: 'cards'
  cards: { label: string; desc: string; href: string; color: string }[]
}
type PanelData = ImagePanel | CardsPanel

const PANELS: Record<string, PanelData> = {
  Animations: {
    type: 'image',
    image: '/ui/animations-button.png',
    sub: 'Clips · GIFs · Animatics · Loops',
    links: [
      { label: 'All Animations', href: '/animations' },
      { label: 'Gallery',        href: '/gallery' },
      { label: 'Instagram',      href: '/instagram' },
    ],
  },
  Films: {
    type: 'image',
    image: '/ui/films-button.png',
    sub: 'Short films & productions',
    links: [{ label: 'View All Films', href: '/films' }],
  },
  Personal: {
    type: 'image',
    image: '/ui/life-drawings-button.jpeg',
    sub: 'Images · Life drawings · Personal work',
    links: [
      { label: 'View All',      href: '/personal' },
      { label: 'Life Drawings', href: '/personal?collection=life-drawings' },
    ],
  },
  'About Me': {
    type: 'cards',
    cards: [
      { label: 'About & Bio',   desc: 'Story, portrait & resume',  href: '/about',          color: 'bg-primary/8' },
      { label: 'Skills',        desc: 'Software & experience',      href: '/skills',         color: 'bg-secondary/8' },
      { label: 'Services',      desc: 'Freelance & commission',     href: '/services',       color: 'bg-accent/15' },
      { label: 'Contact Me →', desc: 'Say hello',                  href: '/about#contact',  color: 'bg-primary/12' },
    ],
  },
}

function PanelImage({
  label, content, onClose, pathname,
}: { label: string; content: ImagePanel; onClose: () => void; pathname: string }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-[220px_1fr] gap-10 items-center">
      {/* Image preview */}
      <div className="aspect-[4/3] rounded-xl overflow-hidden relative shadow-sm">
        <div
          className="absolute inset-0 bg-cover bg-center scale-100 hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${content.image})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-earth/60 to-transparent" />
        <p className="absolute bottom-3 left-3 text-xs font-black text-white drop-shadow">{label}</p>
      </div>

      {/* Links */}
      <div>
        <p className="text-[10px] tracking-[0.22em] uppercase font-semibold text-muted mb-5">{content.sub}</p>
        <ul className="space-y-1">
          {content.links.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className={`group inline-flex items-center gap-2.5 py-1.5 text-2xl font-black tracking-tight transition-colors ${
                  pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 origin-left rounded-full" />
                </span>
                <svg className="w-4 h-4 text-muted/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PanelCards({ content, onClose }: { content: CardsPanel; onClose: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-3">
      {content.cards.map((card, i) => (
        <motion.div
          key={card.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={card.href}
            onClick={onClose}
            className={`group block rounded-xl p-5 ${card.color} hover:bg-primary/12 active:scale-98 transition-all duration-200`}
          >
            <p className="font-black text-base text-foreground group-hover:text-primary transition-colors leading-tight">{card.label}</p>
            <p className="text-xs text-muted mt-1.5 leading-snug">{card.desc}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const panel = open ? PANELS[open] : null

  return (
    <header className="fixed top-0 left-0 right-0 z-50" onMouseLeave={() => setOpen(null)}>
      {/* Bar */}
      <div className="bg-background/92 backdrop-blur-md border-b border-border/30 relative z-10">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="group shrink-0 flex flex-col justify-center leading-none gap-0.5" onClick={() => setOpen(null)}>
            <span className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
              Kristin Thaeler
            </span>
            <span className="text-[9px] tracking-[0.22em] uppercase text-muted group-hover:text-primary/70 transition-colors duration-200">
              @firresketches
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setOpen(item.label)}
                  onClick={() => setOpen(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                    isActive(item.href) || open === item.label
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-surface'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/about#contact"
            className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 active:scale-95 transition-all duration-150 shrink-0"
          >
            Hire Me
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.div animate={mobileOpen ? 'open' : 'closed'} className="flex flex-col gap-[5px] w-5">
              {[
                { open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } },
                { open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } },
                { open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } },
              ].map((v, i) => (
                <motion.span key={i} variants={v} className="block h-px bg-current origin-center" />
              ))}
            </motion.div>
          </button>
        </nav>
      </div>

      {/* Full-width panel dropdown */}
      <AnimatePresence>
        {open && panel && (
          <motion.div
            key={open}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute left-0 right-0 top-full bg-background/97 backdrop-blur-md border-b border-border/30 shadow-lg shadow-bark/5"
          >
            {panel.type === 'image'
              ? <PanelImage label={open} content={panel} onClose={() => setOpen(null)} pathname={pathname} />
              : <PanelCards content={panel} onClose={() => setOpen(null)} />
            }
            {/* Subtle peach accent line at bottom */}
            <div className="h-[2px] bg-linear-to-r from-transparent via-primary/25 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-b border-border/30 bg-background/97 backdrop-blur-md"
          >
            <div className="px-6 py-5 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block py-3 text-base font-bold transition-colors border-b border-border/20 last:border-0 ${
                    isActive(item.href) ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/about#contact"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold"
                  onClick={() => setMobileOpen(false)}
                >
                  Hire Me
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
