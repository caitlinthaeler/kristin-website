'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Collection, Media } from '@/types'
import { input, primaryBtn, ghostBtn, rowBtn } from '../components/adminStyles'
import Field from '../components/Field'
import Modal from '../components/Modal'
import { r2url, isVideo } from '@/lib/r2'
import MediaPicker from '../components/MediaPicker'

export default function CollectionsManager() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Collection | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<Collection | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/collections')
      .then((r) => r.json() as Promise<Collection[]>)
      .then((d) => { setCollections(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: CollectionFormData) {
    setSaving(true)
    try {
      await fetch('/api/admin/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setShowAdd(false); load()
    } finally { setSaving(false) }
  }

  async function handleEdit(data: CollectionFormData) {
    if (!editTarget) return
    setSaving(true)
    try {
      await fetch(`/api/admin/collections/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setEditTarget(null); load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this collection? Media links will be removed.')) return
    await fetch(`/api/admin/collections/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="text-sm text-muted mt-0.5">{collections.length} collections</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ New Collection</button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : collections.length === 0 ? (
        <p className="text-sm text-muted">No collections yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Parent</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Hidden</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" />
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => {
                const parent = c.parent_id ? collections.find((p) => p.id === c.parent_id) : null
                return (
                  <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-surface transition-colors ${c.hidden ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{c.title}</p>
                      {c.description && <p className="text-xs text-muted truncate max-w-xs">{c.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{parent?.title ?? '—'}</td>
                    <td className="px-4 py-3">{c.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className={c.hidden ? 'text-primary text-xs' : 'text-muted text-xs'}>
                        {c.hidden ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setMediaTarget(c)} className={rowBtn}>Media</button>
                        <button onClick={() => setEditTarget(c)} className={rowBtn}>Edit</button>
                        <button onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive/70 text-xs transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="New Collection" onClose={() => setShowAdd(false)}>
          <CollectionForm
            initial={{ title: '', description: null, parent_id: null, hidden: false, sort_order: 0 }}
            collections={collections}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Collection" onClose={() => setEditTarget(null)}>
          <CollectionForm
            initial={{ title: editTarget.title, description: editTarget.description, parent_id: editTarget.parent_id, hidden: editTarget.hidden, sort_order: editTarget.sort_order }}
            collections={collections.filter((c) => c.id !== editTarget.id)}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
      {mediaTarget && (
        <Modal title={`Media — ${mediaTarget.title}`} onClose={() => setMediaTarget(null)} size="lg">
          <CollectionMediaEditor collectionId={mediaTarget.id} onClose={() => setMediaTarget(null)} />
        </Modal>
      )}
    </div>
  )
}

/* ── Collection Form ────────────────────────────────────────────────── */

type CollectionFormData = {
  title: string
  description: string | null
  parent_id: number | null
  hidden: boolean
  sort_order: number
}

function CollectionForm({
  initial,
  collections,
  onSave,
  onCancel,
  saving,
}: {
  initial: CollectionFormData
  collections: Collection[]
  onSave: (data: CollectionFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof CollectionFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Title *">
        <input required className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className={`${input} resize-none`} rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value || null)} />
      </Field>
      <Field label="Parent Collection">
        <select className={input} value={form.parent_id ?? ''} onChange={(e) => set('parent_id', e.target.value ? Number(e.target.value) : null)}>
          <option value="">None (top level)</option>
          {collections.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </Field>
      <Field label="Sort Order">
        <input type="number" className={input} value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
      </Field>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={form.hidden} onChange={(e) => set('hidden', e.target.checked)} /> Hidden
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Collection Media Editor ────────────────────────────────────────── */

function CollectionMediaEditor({ collectionId, onClose }: { collectionId: number; onClose: () => void }) {
  const [collectionMedia, setCollectionMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/collections/${collectionId}/media`)
      .then((r) => r.json() as Promise<Media[]>)
      .then((cm) => {
        setCollectionMedia(Array.isArray(cm) ? cm : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [collectionId])

  useEffect(() => { load() }, [load])

  const inCollection = new Set(collectionMedia.map((m) => m.id))

  async function addMedia(ids: number[]) {
    setAdding(true)
    await fetch(`/api/admin/collections/${collectionId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_ids: ids }),
    })
    setAdding(false)
    load()
  }

  async function removeMedia(id: number) {
    await fetch(`/api/admin/collections/${collectionId}/media`, {
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
      {/* Current media in collection */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          In Collection ({collectionMedia.length})
        </h4>
        {collectionMedia.length === 0 ? (
          <p className="text-sm text-muted">No media in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {collectionMedia.map((m) => (
              <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden bg-surface border border-border">
                {isVideo(m.filename) ? (
                  <video src={r2url(m.filename)} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  <img src={r2url(m.thumbnail ?? m.filename)} alt={m.title ?? ''} className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from collection"
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

      {/* Add media section */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Add Media</h4>
        <MediaPicker
          multi
          excludeIds={inCollection}
          onSelect={(media) => {
            addMedia(media.map((m) => m.id))
          }}
        />
      </div>

      <div className="pt-2 border-t border-border">
        <button onClick={onClose} className={ghostBtn}>Done</button>
      </div>
    </div>
  )
}
