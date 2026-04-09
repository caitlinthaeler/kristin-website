'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

interface Props {
  animations: Media[]
  initialIndex: number
  onClose: () => void
}

export default function AnimationViewer({ animations, initialIndex, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const item = animations[current]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setCurrent((i) => Math.min(i + 1, animations.length - 1))
      if (e.key === 'ArrowLeft') setCurrent((i) => Math.max(i - 1, 0))
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [animations.length, onClose])

  useEffect(() => {
    const el = thumbsRef.current?.children[current] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [current])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-overlay/95 backdrop-blur-md flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center text-muted hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 glass rounded-full px-3 py-1 text-[11px] text-muted">
        {current + 1} / {animations.length}
      </div>

      {/* Main media */}
      <div
        className="flex-1 flex items-center justify-center w-full px-4 md:px-16 pt-16 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {item && (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              {isVideo(item.filename) ? (
                <video
                  src={r2url(item.filename)}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[65vh] max-w-[88vw] rounded-xl shadow-2xl shadow-black/60"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r2url(item.filename)}
                  alt={item.title ?? ''}
                  className="max-h-[65vh] max-w-[88vw] object-contain rounded-xl shadow-2xl shadow-black/60"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      {(item?.title || item?.description) && (
        <div className="text-center px-4 pb-3" onClick={(e) => e.stopPropagation()}>
          {item.title && <p className="text-foreground font-semibold">{item.title}</p>}
          {item.description && <p className="text-muted text-sm mt-1 max-w-sm mx-auto">{item.description}</p>}
        </div>
      )}

      {/* Thumbnail carousel */}
      <div
        ref={thumbsRef}
        className="flex gap-2 overflow-x-auto px-6 pb-5 scroll-x w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {animations.map((anim, i) => (
          <button
            key={anim.id}
            onClick={() => setCurrent(i)}
            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
              i === current
                ? 'ring-2 ring-primary ring-offset-1 ring-offset-overlay/80 opacity-100 scale-110'
                : 'opacity-40 hover:opacity-70 hover:scale-105'
            }`}
          >
            {isVideo(anim.filename) ? (
              <video src={r2url(anim.filename)} muted className="w-full h-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r2url(anim.filename)} alt="" className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => i - 1) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground hover:bg-shade transition-all"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {current < animations.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => i + 1) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground hover:bg-shade transition-all"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}
