'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { r2url, isVideo, isImage } from '@/lib/r2'
import type { Media, MediaType } from '@/types'

interface MediaPickerProps {
  /** Called when user selects one or more media */
  onSelect: (media: Media[]) => void
  /** Allow multiple selections from library */
  multi?: boolean
  /** Pre-selected media IDs to exclude from the library */
  excludeIds?: Set<number>
  /** Filter media by type */
  filterType?: MediaType
}

const TAB_STYLE_ACTIVE = 'px-4 py-2 text-sm font-semibold text-primary border-b-2 border-primary transition-colors'
const TAB_STYLE = 'px-4 py-2 text-sm font-semibold text-muted hover:text-foreground border-b-2 border-transparent transition-colors'

/**
 * Reusable media picker with two tabs:
 * 1. Upload New — upload a file directly and create a media record
 * 2. Browse Library — pick from existing media in the database
 */
export default function MediaPicker({ onSelect, multi = false, excludeIds, filterType }: MediaPickerProps) {
  const [tab, setTab] = useState<'upload' | 'browse'>('browse')

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        <button
          type="button"
          className={tab === 'browse' ? TAB_STYLE_ACTIVE : TAB_STYLE}
          onClick={() => setTab('browse')}
        >
          Browse Library
        </button>
        <button
          type="button"
          className={tab === 'upload' ? TAB_STYLE_ACTIVE : TAB_STYLE}
          onClick={() => setTab('upload')}
        >
          Upload New
        </button>
      </div>

      {tab === 'browse' ? (
        <BrowseTab onSelect={onSelect} multi={multi} excludeIds={excludeIds} filterType={filterType} />
      ) : (
        <UploadTab onSelect={onSelect} />
      )}
    </div>
  )
}

/* ── Browse Tab ─────────────────────────────────────────────────────── */

function BrowseTab({ onSelect, multi, excludeIds, filterType }: MediaPickerProps) {
  const [allMedia, setAllMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json() as Promise<Media[]>)
      .then((d) => { setAllMedia(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = allMedia.filter((m) => {
    if (excludeIds?.has(m.id)) return false
    if (filterType && m.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return (m.title ?? '').toLowerCase().includes(q) || m.filename.toLowerCase().includes(q)
    }
    return true
  })

  function toggleSelect(id: number) {
    if (multi) {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      // Single select: immediately fire
      const item = allMedia.find((m) => m.id === id)
      if (item) onSelect([item])
    }
  }

  function confirmMulti() {
    const items = allMedia.filter((m) => selected.has(m.id))
    if (items.length > 0) onSelect(items)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square skeleton rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <input
        className="w-full bg-surface text-foreground border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Search media…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted py-4 text-center">No media available.</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
          {filtered.slice(0, 60).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleSelect(m.id)}
              className={`group relative aspect-square rounded-lg overflow-hidden bg-surface border-2 transition-colors cursor-pointer ${
                selected.has(m.id) ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            >
              {isVideo(m.filename) ? (
                <video src={r2url(m.filename)} className="w-full h-full object-cover" muted preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r2url(m.thumbnail ?? m.filename)} alt={m.title ?? ''} className="w-full h-full object-cover" />
              )}
              {!multi && (
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 drop-shadow">+</span>
                </div>
              )}
              {multi && selected.has(m.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  ✓
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-overlay/60 text-[10px] text-white px-1.5 py-0.5 truncate">
                {m.title ?? m.filename.split('/').pop()}
              </div>
            </button>
          ))}
        </div>
      )}

      {multi && selected.size > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted">{selected.size} selected</span>
          <button
            type="button"
            onClick={confirmMulti}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/85 transition-colors"
          >
            Add Selected
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Upload Tab ─────────────────────────────────────────────────────── */

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'animation', label: 'Animation' },
  { value: 'animatic', label: 'Animatic' },
  { value: 'gif', label: 'GIF' },
  { value: 'film', label: 'Film' },
  { value: 'life-drawing', label: 'Life Drawing' },
]

function UploadTab({ onSelect }: Pick<MediaPickerProps, 'onSelect'>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>('image')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = file ? URL.createObjectURL(file) : null

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      // 1. Upload file to R2
      const form = new FormData()
      form.append('file', file)
      form.append('folder', mediaType === 'film' ? 'films' : mediaType === 'life-drawing' ? 'life-drawings' : 'media')
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const uploadJson = await uploadRes.json() as { key?: string; error?: string }
      if (!uploadRes.ok || !uploadJson.key) throw new Error(uploadJson.error ?? 'Upload failed')

      // 2. Create media record in DB
      const mediaRes = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: uploadJson.key,
          title: title.trim() || null,
          type: mediaType,
        }),
      })
      const media = await mediaRes.json() as Media
      if (!mediaRes.ok) throw new Error('Failed to create media record')

      onSelect([media])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [file, title, mediaType, onSelect])

  return (
    <div className="space-y-4">
      {/* File drop zone */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,.pdf,.gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) {
              setFile(f)
              // Auto-detect type from extension
              const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
              if (['mp4', 'mov', 'webm'].includes(ext)) setMediaType('animation')
              else if (ext === 'gif') setMediaType('gif')
              else setMediaType('image')

              if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '))
            }
            e.target.value = ''
          }}
        />
        {file ? (
          <div className="flex items-center gap-3">
            {previewUrl && isImage(file.name) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-16 w-24 object-cover rounded shrink-0" />
            )}
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="text-xs text-muted hover:text-destructive"
            >
              ✕
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted">Click to choose a file, or drag and drop</p>
            <p className="text-xs text-muted/60 mt-1">Images, videos, GIFs, PDFs</p>
          </div>
        )}
      </div>

      {file && (
        <>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1 uppercase tracking-wide">Title</label>
            <input
              className="w-full bg-surface text-foreground border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1 uppercase tracking-wide">Type</label>
            <select
              className="w-full bg-surface text-foreground border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
            >
              {MEDIA_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/85 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Upload & Add'}
          </button>
        </>
      )}
    </div>
  )
}
