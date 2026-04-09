'use client'

import { useEffect, useState } from 'react'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

function FilmSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="aspect-video skeleton" />
      <div className="py-2 space-y-3">
        <div className="h-6 w-48 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-3/4 skeleton" />
      </div>
    </div>
  )
}

export default function FilmsList() {
  const [films, setFilms] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/films')
      .then((r) => r.json() as Promise<Media[]>)
      .then((data) => { setFilms(data); setLoading(false) })
      .catch(() => { setError('Failed to load films.'); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="space-y-16">
        <FilmSkeleton />
        <FilmSkeleton />
      </div>
    )
  }

  if (error) return <p className="text-muted">{error}</p>
  if (films.length === 0) return <p className="text-muted">No films yet.</p>

  return (
    <div className="space-y-20">
      {films.map((film) => (
        <article key={film.id} className="grid md:grid-cols-2 gap-8 items-start">
          <div className="aspect-video bg-surface rounded-xl overflow-hidden">
            {isVideo(film.filename) ? (
              <video
                src={r2url(film.filename)}
                controls
                playsInline
                className="w-full h-full object-cover"
                poster={film.thumbnail ? r2url(film.thumbnail) : undefined}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r2url(film.filename)} alt={film.title ?? ''} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="py-2">
            {film.title && <h2 className="text-2xl font-semibold mb-3">{film.title}</h2>}
            {film.description && <p className="text-muted leading-relaxed">{film.description}</p>}
            {film.created_date && <p className="text-sm text-muted mt-4 opacity-60">{film.created_date}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}
