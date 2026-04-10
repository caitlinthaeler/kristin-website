'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Service } from '@/types'
import Modal from '../components/Modal'
import { primaryBtn } from '../components/adminStyles'
import ServiceForm, { type ServiceFormData } from './components/ServiceForm'
import ServicesList from './components/ServicesList'

const EMPTY: ServiceFormData = { title: '', description: null, price_info: null, content_type: 'text', content_url: null, hidden: false, sort_order: 0 }

export default function ServicesManager() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/services')
      .then((r) => r.json() as Promise<Service[]>)
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(data: ServiceFormData) {
    setSaving(true)
    try {
      await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setShowAdd(false); load()
    } finally { setSaving(false) }
  }

  async function handleEdit(data: ServiceFormData) {
    if (!editTarget) return
    setSaving(true)
    try {
      await fetch(`/api/admin/services/${editTarget.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setEditTarget(null); load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted mt-0.5">{items.length} offerings</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ Add Service</button>
      </div>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
        : <ServicesList items={items} onEdit={setEditTarget} onDelete={handleDelete} />
      }

      {showAdd && (
        <Modal title="Add Service" onClose={() => setShowAdd(false)}>
          <ServiceForm initial={EMPTY} onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
        </Modal>
      )}
      {editTarget && (
        <Modal title="Edit Service" onClose={() => setEditTarget(null)}>
          <ServiceForm
            initial={{ title: editTarget.title, description: editTarget.description, price_info: editTarget.price_info, content_type: editTarget.content_type, content_url: editTarget.content_url, hidden: editTarget.hidden, sort_order: editTarget.sort_order }}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
