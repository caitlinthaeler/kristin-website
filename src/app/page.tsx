import Link from 'next/link'
import { r2url } from '@/lib/r2'

const FEATURED_FILM = 'films/Thaeler_WhenTheSnowFalls_052825.mp4'
const FEATURED_TITLE = 'When The Snow Falls'

const NAV_BUTTONS = [
  { href: '/animations', label: 'Animations', image: '/ui/animations-button.png' },
  { href: '/films', label: 'Films', image: '/ui/films-button.png' },
  { href: '/life-drawings', label: 'Life Drawings', image: '/ui/life-drawings-button.jpeg' },
  { href: '/about', label: 'About Me', image: '/ui/about-me-button.jpeg' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — featured film */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Kristin Thaeler</h1>
        <p className="text-muted-text mb-10 text-lg">animator · firresketches</p>

        <div className="w-full max-w-4xl">
          <p className="text-sm text-muted-text uppercase tracking-widest mb-3">{FEATURED_TITLE}</p>
          <video
            src={r2url(FEATURED_FILM)}
            controls
            playsInline
            className="w-full rounded-lg bg-surface"
          />
        </div>
      </section>

      {/* Navigation buttons */}
      <section className="px-6 pb-20 mt-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {NAV_BUTTONS.map(({ href, label, image }) => (
            <Link
              key={href}
              href={href}
              className="relative overflow-hidden rounded-xl aspect-[3/4] group hover-lift"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
              <span className="absolute bottom-4 left-0 right-0 text-center text-white font-semibold text-lg tracking-wide">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
