'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

function FilmSkeleton() {
  return (
    <div className="mb-20">
      <div className="aspect-video w-full skeleton mb-6" />
      <div className="h-6 w-64 skeleton mb-3" />
      <div className="h-4 w-full skeleton mb-2" />
      <div className="h-4 w-3/4 skeleton" />
    </div>
  )
}

// Generates a thumbnail from the middle of a video using canvas
function useVideoMidThumbnail(src: string, skip: boolean): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (skip || !src) return
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.muted = true
    video.src = src

    const onLoaded = () => {
      if (!isFinite(video.duration) || video.duration === 0) return
      video.currentTime = video.duration * 0.5
    }
    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        setDataUrl(canvas.toDataURL('image/jpeg', 0.8))
      } catch {
        // CORS or decode error — silently skip
      }
      video.src = ''
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('seeked', onSeeked)
    video.load()

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('seeked', onSeeked)
      video.src = ''
    }
  }, [src, skip])

  return dataUrl
}

interface FilmVideoProps {
  film: Media
}

function FilmVideo({ film }: FilmVideoProps) {
  const src = r2url(film.filename)
  const customPoster = film.thumbnail ? r2url(film.thumbnail) : null
  const autoPoster = useVideoMidThumbnail(src, !!customPoster || !isVideo(film.filename))
  const poster = customPoster ?? autoPoster ?? undefined

  if (!isVideo(film.filename)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={film.title ?? ''} className="w-full aspect-video object-cover" />
  }

  return (
    <video
      src={src}
      controls
      playsInline
      className="w-full aspect-video object-cover"
      poster={poster}
    />
  )
}

interface FilmEntryProps {
  film: Media
}

function FilmEntry({ film }: FilmEntryProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-24"
    >
      {/* Video — full width, cinematic */}
      <div className="relative w-full bg-surface overflow-hidden mb-6">
        <FilmVideo film={film} />
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
        <div>
          {film.title && (
            <h2 className="text-2xl font-black tracking-tight mb-2 text-foreground hover:text-primary transition-colors">
              <Link href={`/films/${film.id}`}>{film.title}</Link>
            </h2>
          )}
          {film.description && (
            <p className="text-muted leading-relaxed max-w-xl text-sm">{film.description}</p>
          )}
          <div className="mt-4">
            <Link
              href={`/films/${film.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/75 transition-colors"
            >
              See more
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
          </div>
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
      {films.map((film) => (
        <FilmEntry key={film.id} film={film} />
      ))}
    </div>
  )
}
