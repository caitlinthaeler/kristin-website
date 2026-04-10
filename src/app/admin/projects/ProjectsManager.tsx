'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Project } from '@/types'
import Modal from '../components/Modal'
import { primaryBtn } from '../components/adminStyles'
import ProjectForm, { type ProjectFormData } from './components/ProjectForm'
import ProjectsTable from './components/ProjectsTable'

const EMPTY: ProjectFormData = { title: '', description: null, thumbnail: null, hidden: false, sort_order: 0 }

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Project | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/projects')
      .then((r) => r.json() as Promise<Project[]>)
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: ProjectFormData) {
    setSaving(true)
    try {
      await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setShowAdd(false); load()
    } finally { setSaving(false) }
  }

  async function handleEdit(data: ProjectFormData) {
    if (!editTarget) return
    setSaving(true)
    try {
      await fetch(`/api/admin/projects/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setEditTarget(null); load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this project? Media links will be removed.')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted mt-0.5">{items.length} projects</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ New Project</button>
      </div>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        : <ProjectsTable items={items} onEdit={setEditTarget} onDelete={handleDelete} />
      }

      {showAdd && (
        <Modal title="New Project" onClose={() => setShowAdd(false)}>
          <ProjectForm initial={EMPTY} onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Project" onClose={() => setEditTarget(null)}>
          <ProjectForm
            initial={{ title: editTarget.title, description: editTarget.description, thumbnail: editTarget.thumbnail, hidden: editTarget.hidden, sort_order: editTarget.sort_order }}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
