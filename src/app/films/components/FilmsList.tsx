'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

function FilmSkeleton() {
  return (
    <div className="mb-24">
      <div className="h-px bg-veil mb-10" />
      <div className="h-4 w-20 skeleton mb-6" />
      <div className="aspect-video w-full skeleton mb-8" />
      <div className="h-8 w-64 skeleton mb-4" />
      <div className="h-4 w-full skeleton mb-2" />
      <div className="h-4 w-3/4 skeleton" />
    </div>
  )
}

interface FilmEntryProps {
  film: Media
  index: number
}

function FilmEntry({ film, index }: FilmEntryProps) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-28"
    >
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-primary/40 via-veil to-transparent mb-10" />

      {/* Film number */}
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-[11px] tracking-[0.2em] uppercase text-primary font-semibold">Film</span>
        <span className="text-6xl md:text-8xl font-black text-veil/40 leading-none select-none">{num}</span>
      </div>

      {/* Video — full width, cinematic */}
      <div className="relative w-full bg-void rounded-xl overflow-hidden mb-8 group">
        {isVideo(film.filename) ? (
          <video
            src={r2url(film.filename)}
            controls
            playsInline
            className="w-full aspect-video object-cover"
            poster={film.thumbnail ? r2url(film.thumbnail) : undefined}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r2url(film.filename)} alt={film.title ?? ''} className="w-full aspect-video object-cover" />
        )}
      </div>

      {/* Info — two column on md+ */}
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
        <div>
          {film.title && (
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-fire">
              {film.title}
            </h2>
          )}
          {film.description && (
            <p className="text-silver leading-relaxed max-w-xl">{film.description}</p>
          )}
        </div>
        {film.created_date && (
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted pt-1 whitespace-nowrap">
            {film.created_date}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export default function FilmsList() {
  const [films, setFilms] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/films')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Media[]>
      })
      .then((data) => {
        setFilms(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load films.'); setLoading(false) })
  }, [])

  if (loading) return <div>{[0, 1].map((i) => <FilmSkeleton key={i} />)}</div>
  if (error) return <p className="text-muted">{error}</p>
  if (films.length === 0) return <p className="text-muted">No films yet.</p>

  return (
    <div>
      {films.map((film, i) => (
        <FilmEntry key={film.id} film={film} index={i} />
      ))}
    </div>
  )
}
