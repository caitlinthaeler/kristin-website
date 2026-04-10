'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Achievement } from '@/types'
import Modal from '../components/Modal'
import { primaryBtn } from '../components/adminStyles'
import AchievementForm, { type AchievementFormData, CATEGORIES } from './components/AchievementForm'
import AchievementsTable from './components/AchievementsTable'

const EMPTY: AchievementFormData = { category: 'software', title: '', subtitle: null, date_text: null, hidden: false, sort_order: 0 }

export default function AchievementsManager() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Achievement | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/achievements')
      .then((r) => r.json() as Promise<Achievement[]>)
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: AchievementFormData) {
    setSaving(true)
    try {
      await fetch('/api/admin/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setShowAdd(false); load()
    } finally { setSaving(false) }
  }

  async function handleEdit(data: AchievementFormData) {
    if (!editTarget) return
    setSaving(true)
    try {
      await fetch(`/api/admin/achievements/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setEditTarget(null); load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills & Achievements</h1>
          <p className="text-sm text-muted mt-0.5">{items.length} entries</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ Add Entry</button>
      </div>

      {loading
        ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}</div>
        : <AchievementsTable items={items} categories={CATEGORIES} onEdit={setEditTarget} onDelete={handleDelete} />
      }

      {showAdd && (
        <Modal title="Add Entry" onClose={() => setShowAdd(false)} size="md">
          <AchievementForm initial={EMPTY} onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Entry" onClose={() => setEditTarget(null)} size="md">
          <AchievementForm
            initial={{ category: editTarget.category, title: editTarget.title, subtitle: editTarget.subtitle, date_text: editTarget.date_text, hidden: editTarget.hidden, sort_order: editTarget.sort_order }}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
