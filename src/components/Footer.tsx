import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6 text-sm text-muted">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Kristin Thaeler · firresketches</p>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/firresketches"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <Link href="/about#contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <Link href="/services" className="hover:text-foreground transition-colors">
            Hire Me
          </Link>
        </div>
      </div>
    </footer>
  )
}
