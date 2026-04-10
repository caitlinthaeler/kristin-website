'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { r2url, isVideo } from '@/lib/r2'
import type { Collection, Media } from '@/types'

// ── Sidebar tree item ───────────────────────────────────────────────────────
interface TreeItemProps {
  col: Collection & { children?: Collection[] }
  depth: number
  selected: string
  onSelect: (id: string) => void
}

function TreeItem({ col, depth, selected, onSelect }: TreeItemProps) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = col.children && col.children.length > 0
  const isSelected = selected === String(col.id)

  return (
    <li>
      <div className={`flex items-center gap-1 rounded-lg transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-foreground hover:bg-surface'
      }`} style={{ paddingLeft: `${0.5 + depth * 1}rem`, paddingRight: '0.5rem' }}>
        {hasChildren ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-0.5 text-current opacity-50 hover:opacity-100 shrink-0"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <button
          onClick={() => onSelect(String(col.id))}
          className="flex-1 text-left py-1.5 text-sm font-medium truncate"
        >
          {col.title}
        </button>
      </div>
      {hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5">
          {col.children?.map((child) => (
            <TreeItem key={child.id} col={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  )
}

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose }: { item: Media; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const src = r2url(item.filename)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 bg-bark/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
        aria-label="Close"
      >
        ×
      </button>
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="max-w-4xl w-full max-h-[90dvh] overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(item.filename) ? (
          <video src={src} controls autoPlay playsInline className="w-full max-h-[80dvh] object-contain bg-bark" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={item.title ?? ''} className="w-full max-h-[80dvh] object-contain bg-bark" />
        )}
        {item.title && (
          <div className="bg-background px-5 py-3">
            <p className="font-semibold text-sm text-foreground">{item.title}</p>
            {item.description && <p className="text-xs text-muted mt-0.5">{item.description}</p>}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Gallery grid cell ────────────────────────────────────────────────────────
function GalleryItem({ item, onClick }: { item: Media; onClick: () => void }) {
  const src = r2url(item.filename)
  const thumb = item.thumbnail ? r2url(item.thumbnail) : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="break-inside-avoid mb-3 group cursor-pointer relative rounded-lg overflow-hidden"
      onClick={onClick}
    >
      {isVideo(item.filename) ? (
        <div className="relative bg-surface">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={item.title ?? ''} className="w-full object-cover" loading="lazy" />
          ) : (
            <div className="aspect-video bg-surface flex items-center justify-center">
              <svg className="w-8 h-8 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-bark/60 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={item.title ?? ''}
          className="w-full object-cover"
          loading="lazy"
        />
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-bark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {item.title && (
          <p className="absolute bottom-2 left-3 right-3 text-xs font-semibold text-white truncate">
            {item.title}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
type CollectionNode = Collection & { children?: CollectionNode[] }

function buildTree(flat: Collection[]): CollectionNode[] {
  const map = new Map<number, CollectionNode>()
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }))
  const roots: CollectionNode[] = []
  flat.forEach((c) => {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children!.push(map.get(c.id)!)
    } else {
      roots.push(map.get(c.id)!)
    }
  })
  return roots
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az',     label: 'A → Z' },
  { value: 'za',     label: 'Z → A' },
]

export default function GalleryBrowser() {
  const [collections, setCollections] = useState<CollectionNode[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string>('all')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [sort, setSort] = useState('newest')
  const [lightbox, setLightbox] = useState<Media | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300)
    return () => clearTimeout(t)
  }, [q])

  // Load collections
  useEffect(() => {
    fetch('/api/collections')
      .then((r) => (r.ok ? (r.json() as Promise<Collection[]>) : ([] as Collection[])))
      .then((data) => setCollections(buildTree(Array.isArray(data) ? data : [])))
      .catch(() => {})
  }, [])

  // Load media
  const loadMedia = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ collection: selected, sort })
    if (debouncedQ) params.set('q', debouncedQ)
    fetch(`/api/gallery?${params}`)
      .then((r) => (r.ok ? (r.json() as Promise<Media[]>) : Promise.reject()))
      .then((data) => { setMedia(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setMedia([]); setLoading(false) })
  }, [selected, sort, debouncedQ])

  useEffect(() => { loadMedia() }, [loadMedia])

  const selectedLabel = selected === 'all'
    ? 'All Work'
    : collections.flatMap(function flat(c): CollectionNode[] { return [c, ...(c.children ?? []).flatMap(flat)] })
        .find((c) => String(c.id) === selected)?.title ?? 'Collection'

  return (
    <div className="flex gap-0 min-h-[60dvh]">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:block w-52 shrink-0 pr-6">
        <div className="sticky top-24 space-y-1">
          <button
            onClick={() => setSelected('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selected === 'all' ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-foreground hover:bg-surface'
            }`}
          >
            All Work
          </button>
          {collections.length > 0 && (
            <>
              <p className="px-3 pt-3 text-[10px] tracking-[0.2em] uppercase text-muted font-semibold">Collections</p>
              <ul className="space-y-0.5">
                {collections.map((col) => (
                  <TreeItem key={col.id} col={col} depth={0} selected={selected} onSelect={setSelected} />
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h12M3 12h6" />
            </svg>
            {selectedLabel}
          </button>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-surface rounded-full border border-border/40 text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 transition"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm bg-surface border border-border/40 rounded-full px-3 py-1.5 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Count */}
          {!loading && (
            <span className="text-xs text-muted ml-auto">
              {media.length} item{media.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden mb-4 bg-surface rounded-xl p-4"
            >
              <button
                onClick={() => { setSelected('all'); setSidebarOpen(false) }}
                className={`w-full text-left px-2 py-2 rounded-lg text-sm font-semibold ${
                  selected === 'all' ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                All Work
              </button>
              <ul className="mt-1 space-y-0.5">
                {collections.map((col) => (
                  <TreeItem
                    key={col.id}
                    col={col}
                    depth={0}
                    selected={selected}
                    onSelect={(id) => { setSelected(id); setSidebarOpen(false) }}
                  />
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery grid */}
        {loading ? (
          <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`break-inside-avoid mb-3 skeleton rounded-lg ${
                [70, 100, 80, 60, 110, 90][i % 6] ? '' : ''
              }`}
              style={{ height: [140, 200, 160, 120, 220, 180][i % 6] }}
              />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm">{debouncedQ ? `No results for "${debouncedQ}"` : 'Nothing here yet.'}</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-4 gap-3">
            {media.map((item) => (
              <GalleryItem key={item.id} item={item} onClick={() => setLightbox(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}
