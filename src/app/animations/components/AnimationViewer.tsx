'use client'

import { useEffect, useRef, useState } from 'react'
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
    <div
      className="fixed inset-0 z-50 bg-overlay/90 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-foreground/60 hover:text-foreground text-2xl leading-none p-2"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Main media */}
      <div
        className="flex-1 flex items-center justify-center w-full px-4 pt-8 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item && (
          isVideo(item.filename) ? (
            <video
              key={item.id}
              src={r2url(item.filename)}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[70vh] max-w-[90vw] rounded-lg"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={r2url(item.filename)}
              alt={item.title ?? ''}
              className="max-h-[70vh] max-w-[90vw] object-contain rounded-lg"
            />
          )
        )}
      </div>

      {(item?.title || item?.description) && (
        <div className="text-center px-4 pb-3" onClick={(e) => e.stopPropagation()}>
          {item.title && <p className="text-foreground font-semibold">{item.title}</p>}
          {item.description && <p className="text-muted text-sm mt-1">{item.description}</p>}
        </div>
      )}

      {/* Carousel */}
      <div
        ref={thumbsRef}
        className="flex gap-2 overflow-x-auto px-4 pb-4 scroll-x w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {animations.map((anim, i) => (
          <button
            key={anim.id}
            onClick={() => setCurrent(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
              i === current ? 'ring-2 ring-primary opacity-100' : 'opacity-50 hover:opacity-80'
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

      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => i - 1) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground p-2 text-3xl"
          aria-label="Previous"
        >‹</button>
      )}
      {current < animations.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => i + 1) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground p-2 text-3xl"
          aria-label="Next"
        >›</button>
      )}
    </div>
  )
}
