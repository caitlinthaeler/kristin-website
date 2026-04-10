'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { r2url, isImage, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

function Skeleton() {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton break-inside-avoid" style={{ height: `${140 + (i % 3) * 60}px` }} />
      ))}
    </div>
  )
}

interface ItemProps {
  item: Media
  index: number
}

function GalleryItem({ item, index }: ItemProps) {
  const src = r2url(item.filename)
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="break-inside-avoid mb-3 overflow-hidden cursor-pointer group relative bg-surface"
        onClick={() => setOpen(true)}
      >
        {isImage(item.filename) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.title ?? ''}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : isVideo(item.filename) ? (
          <video
            src={src}
            className="w-full object-cover"
            muted
            playsInline
          />
        ) : null}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/30 transition-colors duration-300 flex items-end p-3">
          {item.title && (
            <p className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
              {item.title}
            </p>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-bark/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {isImage(item.filename) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={item.title ?? ''} className="w-full" />
            ) : (
              <video src={src} controls autoPlay className="w-full" />
            )}
            {(item.title || item.description) && (
              <div className="mt-4 text-white">
                {item.title && <p className="font-bold text-lg">{item.title}</p>}
                {item.description && <p className="text-white/70 text-sm mt-1">{item.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function PersonalGallery() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/personal')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Media[]>
      })
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => { setError('Failed to load.'); setLoading(false) })
  }, [])

  if (loading) return <Skeleton />
  if (error) return <p className="text-muted">{error}</p>
  if (items.length === 0) return <p className="text-muted">No items yet.</p>

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
      {items.map((item, i) => (
        <GalleryItem key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}
