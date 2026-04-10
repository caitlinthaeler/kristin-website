import Link from 'next/link'
import SketchButton from '@/components/ui/SketchButton'

const LINKS = [
  { label: 'Films',         href: '/films' },
  { label: 'Animations',   href: '/animations' },
  { label: 'Personal',      href: '/personal' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'Services',     href: '/services' },
  { label: 'About',        href: '/about' },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative bg-bark overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_auto] gap-10 items-end">

        {/* Left — branding */}
        <div>
          <p className="font-black text-xl tracking-tight text-cream mb-0.5">
            Kristin Thaeler
          </p>
          <p className="text-[10px] tracking-[0.22em] uppercase text-cream/60 mb-6">
            @firresketches
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-cream/60 hover:text-primary underline-offset-2 hover:underline transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right — CTA + socials */}
        <div className="flex flex-col items-start md:items-end gap-5">
          <SketchButton href="/about#contact" size="md">Get in Touch</SketchButton>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/firresketches"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-cream/60 hover:text-cream transition-colors duration-150"
              aria-label="Instagram"
            >
              <InstagramIcon />
              <span>@firresketches</span>
            </a>

            <a
              href="https://linkedin.com/in/kristinthaeler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-cream/60 hover:text-cream transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-4 max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-[11px] text-cream/60">
          © {new Date().getFullYear()} Kristin Thaeler
        </p>
        <p className="text-[11px] text-cream/30">
          All rights reserved
        </p>
      </div>
    </footer>
  )
}

