'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'
import AnimationViewer from './AnimationViewer'

// Bento pattern repeating every 6 items:
// [0] large 2×2, [1][2] tall 1×2, [3][4][5] small 1×1
function getCellClass(index: number): string {
  const pos = index % 6
  if (pos === 0) return 'col-span-2 row-span-2'
  if (pos === 1 || pos === 2) return 'col-span-1 row-span-2'
  return 'col-span-1 row-span-1'
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-4 auto-rows-[140px] gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`skeleton ${getCellClass(i)}`} />
      ))}
    </div>
  )
}

interface ThumbnailProps {
  item: Media
  index: number
  onClick: () => void
}

function Thumbnail({ item, index, onClick }: ThumbnailProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      onClick={onClick}
      className={`${getCellClass(index)} group relative overflow-hidden rounded-lg bg-surface focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {isVideo(item.filename) ? (
        <video
          src={r2url(item.filename)}
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={r2url(item.filename)}
          alt={item.title ?? ''}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Overlay with title on hover */}
      <div className="absolute inset-0 bg-linear-to-t from-earth/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        {item.title && (
          <p className="text-xs text-white/90 font-semibold line-clamp-2">{item.title}</p>
        )}
      </div>

      {/* ember top-right corner glow on hover */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-primary/0 group-hover:bg-primary/10 rounded-bl-full transition-all duration-300" />
    </motion.button>
  )
}

export default function AnimationsGallery() {
  const [animations, setAnimations] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/animations')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Media[]>
      })
      .then((data) => {
        setAnimations(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load animations.'); setLoading(false) })
  }, [])

  if (loading) return <GallerySkeleton />
  if (error) return <p className="text-muted">{error}</p>
  if (animations.length === 0) return <p className="text-muted">No animations yet.</p>

  return (
    <>
      <div className="grid grid-cols-4 auto-rows-[140px] gap-2">
        {animations.map((item, index) => (
          <Thumbnail
            key={item.id}
            item={item}
            index={index}
            onClick={() => setActiveIndex(index)}
          />
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
