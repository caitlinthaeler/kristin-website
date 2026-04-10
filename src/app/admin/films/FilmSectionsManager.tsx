'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Media, FilmSection } from '@/types'
import { r2url, isVideo } from '@/lib/r2'
import { input, primaryBtn, ghostBtn, rowBtn } from '../components/adminStyles'
import Field from '../components/Field'
import Modal from '../components/Modal'
import MediaPicker from '../components/MediaPicker'

/* ── Film Sections Manager ─────────────────────────────────────────── */

export default function FilmSectionsManager() {
  const [films, setFilms] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null)

  useEffect(() => {
    fetch('/api/films')
      .then((r) => r.json() as Promise<Media[]>)
      .then((d) => { setFilms(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Film Sections</h1>
        <p className="text-sm text-muted mt-0.5">
          Manage content sections for each film (backgrounds, character concepts, etc.)
        </p>
      </div>

      {/* Film selector */}
      <div className="mb-6">
        <Field label="Select a Film">
          <select
            className={input}
            value={selectedFilm?.id ?? ''}
            onChange={(e) => {
              const f = films.find((f) => f.id === Number(e.target.value))
              setSelectedFilm(f ?? null)
            }}
          >
            <option value="">— Choose a film —</option>
            {films.map((f) => (
              <option key={f.id} value={f.id}>{f.title ?? f.filename}</option>
            ))}
          </select>
        </Field>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
        </div>
      )}

      {selectedFilm && <FilmSectionsList film={selectedFilm} />}
    </div>
  )
}

/* ── Sections List for a Film ──────────────────────────────────────── */

function FilmSectionsList({ film }: { film: Media }) {
  const [sections, setSections] = useState<FilmSection[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<FilmSection | null>(null)
  const [mediaTarget, setMediaTarget] = useState<FilmSection | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/films/${film.id}/sections`)
      .then((r) => r.json() as Promise<FilmSection[]>)
      .then((d) => { setSections(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [film.id])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: SectionFormData) {
    setSaving(true)
    try {
      await fetch(`/api/admin/films/${film.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setShowAdd(false)
      load()
    } finally { setSaving(false) }
  }

  async function handleEdit(data: SectionFormData) {
    if (!editTarget) return
    setSaving(true)
    try {
      await fetch(`/api/admin/films/${film.id}/sections/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setEditTarget(null)
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this section? All linked media will be unlinked.')) return
    await fetch(`/api/admin/films/${film.id}/sections/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Sections for &ldquo;{film.title ?? 'Untitled'}&rdquo;
        </h2>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>
          + New Section
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 skeleton rounded-lg" />)}
        </div>
      ) : sections.length === 0 ? (
        <p className="text-sm text-muted">No sections yet. Add one to organize this film&apos;s content.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((s) => (
            <div key={s.id} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {s.title ?? <span className="text-muted italic">Untitled section</span>}
                  </p>
                  {s.description && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">{s.description}</p>
                  )}
                  <p className="text-xs text-muted/60 mt-1">Order: {s.sort_order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setMediaTarget(s)} className={rowBtn}>Media</button>
                  <button onClick={() => setEditTarget(s)} className={rowBtn}>Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-xs text-destructive hover:text-destructive/70 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="New Section" onClose={() => setShowAdd(false)}>
          <SectionForm
            initial={{ title: '', description: '', sort_order: sections.length }}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Section" onClose={() => setEditTarget(null)}>
          <SectionForm
            initial={{ title: editTarget.title ?? '', description: editTarget.description ?? '', sort_order: editTarget.sort_order }}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
      {mediaTarget && (
        <Modal title={`Media — ${mediaTarget.title ?? 'Untitled'}`} onClose={() => setMediaTarget(null)} size="lg">
          <SectionMediaEditor filmId={film.id} sectionId={mediaTarget.id} onClose={() => setMediaTarget(null)} />
        </Modal>
      )}
    </div>
  )
}

/* ── Section Form ──────────────────────────────────────────────────── */

type SectionFormData = {
  title: string
  description: string
  sort_order: number
}

function SectionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: SectionFormData
  onSave: (data: SectionFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof SectionFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Title">
        <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Backgrounds, Character Concepts" />
      </Field>
      <Field label="Description">
        <textarea className={`${input} resize-none`} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Optional description for this section" />
      </Field>
      <Field label="Sort Order">
        <input type="number" className={input} value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
      </Field>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Section Media Editor ──────────────────────────────────────────── */

function SectionMediaEditor({ filmId, sectionId, onClose }: { filmId: number; sectionId: number; onClose: () => void }) {
  const [sectionMedia, setSectionMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/films/${filmId}/sections/${sectionId}/media`)
      .then((r) => r.json() as Promise<Media[]>)
      .then((d) => { setSectionMedia(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filmId, sectionId])

  useEffect(() => { load() }, [load])

  const inSection = new Set(sectionMedia.map((m) => m.id))

  async function addMedia(ids: number[]) {
    await fetch(`/api/admin/films/${filmId}/sections/${sectionId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_ids: ids }),
    })
    load()
  }

  async function removeMedia(id: number) {
    await fetch(`/api/admin/films/${filmId}/sections/${sectionId}/media`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_ids: [id] }),
    })
    load()
  }

  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>
  }

  return (
    <div className="space-y-5">
      {/* Current media in section */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          In Section ({sectionMedia.length})
        </h4>
        {sectionMedia.length === 0 ? (
          <p className="text-sm text-muted">No media in this section yet.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {sectionMedia.map((m) => (
              <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden bg-surface border border-border">
                {isVideo(m.filename) ? (
                  <video src={r2url(m.filename)} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r2url(m.thumbnail ?? m.filename)} alt={m.title ?? ''} className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from section"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-overlay/60 text-[10px] text-white px-1.5 py-0.5 truncate">
                  {m.title ?? m.filename.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add media via MediaPicker */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Add Media</h4>
        <MediaPicker
          multi
          excludeIds={inSection}
          onSelect={(media) => addMedia(media.map((m) => m.id))}
        />
      </div>

      <div className="pt-2 border-t border-border">
        <button onClick={onClose} className={ghostBtn}>Done</button>
      </div>
    </div>
  )
}
