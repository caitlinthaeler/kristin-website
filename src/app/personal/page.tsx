import type { Metadata } from 'next'
import PersonalGallery from './components/PersonalGallery'

export const metadata: Metadata = { title: 'Personal — Kristin Thaeler' }

export default function PersonalPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold mb-3">Portfolio</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground">Personal</h1>
          <p className="text-muted mt-4 max-w-md">
            Sketchbook, life drawings, and personal work outside of projects.
          </p>
        </div>
        <PersonalGallery />
      </div>
    </div>
  )
}
