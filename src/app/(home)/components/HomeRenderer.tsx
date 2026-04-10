'use client'

import { useEffect, useState } from 'react'
import HeroCinema from './HeroCinema'
import PortfolioGrid from './PortfolioGrid'
import AboutTeaser from './AboutTeaser'
import CommissionCta from './CommissionCta'

interface HomeSectionData {
  id: number
  section_key: string
  label: string
  title: string | null
  subtitle: string | null
  body: string | null
  cta_label: string | null
  cta_href: string | null
  media_id: number | null
  media_filename: string | null
  media_title: string | null
  media_thumbnail: string | null
  hidden: number
  sort_order: number
}

export default function HomeRenderer() {
  const [sections, setSections] = useState<HomeSectionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/home-sections')
      .then((r) => r.json() as Promise<HomeSectionData[]>)
      .then((d) => {
        setSections(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero skeleton */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="skeleton w-64 h-12 mb-4" />
          <div className="skeleton w-48 h-4 mb-8" />
          <div className="skeleton w-full max-w-4xl aspect-video" />
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">No sections configured. Add sections in the admin panel.</p>
      </div>
    )
  }

  return (
    <div>
      {sections.map((s) => {
        switch (s.section_key) {
          case 'hero':
            return (
              <HeroCinema
                key={s.id}
                filmSrc={s.media_filename ?? undefined}
                filmTitle={s.media_title ?? undefined}
                title={s.title}
                subtitle={s.subtitle}
                ctaLabel={s.cta_label}
                ctaHref={s.cta_href}
              />
            )
          case 'portfolio_grid':
            return <PortfolioGrid key={s.id} />
          case 'about_teaser':
            return (
              <AboutTeaser
                key={s.id}
                title={s.title}
                body={s.body}
                ctaLabel={s.cta_label}
                ctaHref={s.cta_href}
              />
            )
          case 'commission_cta':
            return (
              <CommissionCta
                key={s.id}
                title={s.title}
                body={s.body}
                ctaLabel={s.cta_label}
                ctaHref={s.cta_href}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
