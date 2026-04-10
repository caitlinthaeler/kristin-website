'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Media } from '@/types'

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
        ctx?.drawImage(video, 0, 0)
        setDataUrl(canvas.toDataURL('image/jpeg', 0.8))
      } catch { /* CORS / decode */ }
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

interface Props { id: string }

export default function FilmDetail({ id }: Props) {
  const [film, setFilm] = useState<Media | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/films/${id}`)
      .then((r) => (r.ok ? (r.json() as Promise<Media>) : Promise.reject()))
      .then((data) => { setFilm(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  const src = film ? r2url(film.filename) : ''
  const customPoster = film?.thumbnail ? r2url(film.thumbnail) : null
  const autoPoster = useVideoMidThumbnail(src, !film || !!customPoster || !isVideo(film.filename))
  const poster = customPoster ?? autoPoster ?? undefined

  if (loading) {
    return (
      <div>
        <div className="aspect-video w-full skeleton mb-6" />
        <div className="h-7 w-80 skeleton mb-3" />
        <div className="h-4 w-full skeleton mb-2" />
        <div className="h-4 w-2/3 skeleton" />
      </div>
    )
  }

  if (error || !film) {
    return (
      <div className="text-center py-20">
        <p className="text-muted mb-6">Film not found.</p>
        <Link href="/films" className="text-primary font-semibold hover:underline">← Back to Films</Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Back */}
      <Link
        href="/films"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Films
      </Link>

      {/* Video */}
      <div className="relative w-full bg-surface overflow-hidden mb-8 shadow-sm">
        {isVideo(film.filename) ? (
          <video
            src={src}
            controls
            playsInline
            className="w-full aspect-video object-cover"
            poster={poster}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={film.title ?? ''} className="w-full aspect-video object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
            {film.title ?? 'Untitled'}
          </h1>
          {film.description && (
            <p className="text-muted leading-relaxed max-w-2xl">{film.description}</p>
          )}
        </div>
        {film.created_date && (
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted pt-1 whitespace-nowrap">
            {film.created_date}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="pt-10">
        <p className="text-muted text-sm mb-4">Interested in collaborating or discussing this project?</p>
        <Link
          href="/about#contact"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </motion.div>
  )
}
