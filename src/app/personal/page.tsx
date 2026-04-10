import type { Metadata } from 'next'
import PersonalGallery from './components/PersonalGallery'

export const metadata: Metadata = { title: 'Personal — Kristin Thaeler' }

export default function PersonalPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Personal</h1>
          <p className="text-muted mt-2 max-w-md text-sm">
            Sketchbook, life drawings, and personal work outside of projects.
          </p>
        </div>
        <PersonalGallery />
      </div>
    </div>
  )
}
