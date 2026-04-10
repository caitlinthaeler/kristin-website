'use client'

import { useState } from 'react'
import Field from '../../components/Field'
import { input, primaryBtn, ghostBtn } from '../../components/adminStyles'

export type ProjectFormData = {
  title: string
  description: string | null
  thumbnail: string | null
  hidden: boolean
  sort_order: number
}

interface Props {
  initial: ProjectFormData
  onSave: (data: ProjectFormData) => void
  onCancel: () => void
  saving: boolean
}

export default function ProjectForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<ProjectFormData>(initial)
  const set = (k: keyof ProjectFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Title *">
        <input required className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className={`${input} resize-none`} rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value || null)} />
      </Field>
      <Field label="Thumbnail" hint="R2 key">
        <input className={input} value={form.thumbnail ?? ''} onChange={(e) => set('thumbnail', e.target.value || null)} placeholder="projects/cover.jpg" />
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
