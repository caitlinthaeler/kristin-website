'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Media } from '@/types'
import Modal from '../components/Modal'
import { primaryBtn } from '../components/adminStyles'
import MediaForm, { type MediaFormData } from './components/MediaForm'
import MediaTable from './components/MediaTable'

const TYPES = ['film', 'animation', 'animatic', 'gif', 'image', 'life-drawing']

const EMPTY: MediaFormData = { filename: '', title: null, description: null, type: 'animation', thumbnail: null, created_date: null, sort_order: 0, hidden: false, archived: false }

export default function MediaManager() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Media | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/media')
      .then((r) => r.json() as Promise<Media[]>)
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: MediaFormData) {
    setSaving(true); setError(null)
    try {
      const r = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!r.ok) throw new Error((await r.json() as { error: string }).error)
      setShowAdd(false); load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(false) }
  }

  async function handleEdit(data: MediaFormData) {
    if (!editTarget) return
    setSaving(true); setError(null)
    try {
      const r = await fetch(`/api/admin/media/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!r.ok) throw new Error((await r.json() as { error: string }).error)
      setEditTarget(null); load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    const item = items.find((i) => i.id === id)
    if (!confirm(`Delete "${item?.title ?? item?.filename ?? 'this item'}"? This cannot be undone.`)) return

    // Remove from D1
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })

    // Remove files from R2 (best-effort — ignore errors)
    const keysToDelete = [item?.filename, item?.thumbnail].filter(Boolean) as string[]
    for (const key of keysToDelete) {
      fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      }).catch(() => null)
    }

    load()
  }

  async function handleToggle(item: Media, field: 'hidden' | 'archived') {
    await fetch(`/api/admin/media/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, [field]: !item[field] }) })
    load()
  }

  const visible = filter === 'all' ? items : items.filter((i) => i.type === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media</h1>
          <p className="text-sm text-muted mt-0.5">{items.length} total items</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ Add Media</button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {['all', ...TYPES].map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted hover:text-foreground'}`}>{t}</button>
        ))}
      </div>

      {error && <p className="text-destructive text-sm mb-4">{error}</p>}

      {loading
        ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-lg skeleton" />)}</div>
        : <MediaTable items={visible} onEdit={setEditTarget} onDelete={handleDelete} onToggle={handleToggle} />
      }

      {showAdd && (
        <Modal title="Add Media" onClose={() => setShowAdd(false)}>
          <MediaForm initial={EMPTY} onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Media" onClose={() => setEditTarget(null)}>
          <MediaForm
            initial={{ filename: editTarget.filename, title: editTarget.title, description: editTarget.description, type: editTarget.type, thumbnail: editTarget.thumbnail, created_date: editTarget.created_date, sort_order: editTarget.sort_order, archived: editTarget.archived, hidden: editTarget.hidden }}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
