'use client'

import { useEffect, useState } from 'react'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'
import AnimationViewer from './AnimationViewer'

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square skeleton" />
      ))}
    </div>
  )
}

export default function AnimationsGallery() {
  const [animations, setAnimations] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/animations')
      .then((r) => r.json() as Promise<Media[]>)
      .then((data) => { setAnimations(data); setLoading(false) })
      .catch(() => { setError('Failed to load animations.'); setLoading(false) })
  }, [])

  if (loading) return <GallerySkeleton />
  if (error) return <p className="text-muted">{error}</p>
  if (animations.length === 0) return <p className="text-muted">No animations yet.</p>

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {animations.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className="aspect-square bg-surface rounded-lg overflow-hidden group relative interactive-scale"
          >
            {isVideo(item.filename) ? (
              <video
                src={r2url(item.filename)}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r2url(item.filename)} alt={item.title ?? ''} className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <AnimationViewer
          animations={animations}
          initialIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  )
}
