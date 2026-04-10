'use client'

import { useState } from 'react'
import type { MediaType } from '@/types'
import Field from '../../components/Field'
import { input, primaryBtn, ghostBtn } from '../../components/adminStyles'

const TYPES: MediaType[] = ['film', 'animation', 'animatic', 'gif', 'image', 'life-drawing']

export type MediaFormData = {
  filename: string
  title: string | null
  description: string | null
  type: MediaType
  thumbnail: string | null
  created_date: string | null
  sort_order: number
  hidden: boolean
  archived: boolean
}

interface Props {
  initial: MediaFormData
  onSave: (data: MediaFormData) => void
  onCancel: () => void
  saving: boolean
}

export default function MediaForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<MediaFormData>(initial)
  const set = (k: keyof MediaFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Filename (R2 key) *" hint="e.g. films/myvideo.mp4">
        <input required className={input} value={form.filename} onChange={(e) => set('filename', e.target.value)} />
      </Field>
      <Field label="Type *">
        <select className={input} value={form.type} onChange={(e) => set('type', e.target.value as MediaType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Title">
        <input className={input} value={form.title ?? ''} onChange={(e) => set('title', e.target.value || null)} />
      </Field>
      <Field label="Description">
        <textarea className={`${input} resize-none`} rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value || null)} />
      </Field>
      <Field label="Thumbnail (R2 key)" hint="optional">
        <input className={input} value={form.thumbnail ?? ''} onChange={(e) => set('thumbnail', e.target.value || null)} />
      </Field>
      <Field label="Created Date" hint="e.g. Spring 2024">
        <input className={input} value={form.created_date ?? ''} onChange={(e) => set('created_date', e.target.value || null)} />
      </Field>
      <Field label="Sort Order">
        <input type="number" className={input} value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
      </Field>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.hidden} onChange={(e) => set('hidden', e.target.checked)} /> Hidden
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.archived} onChange={(e) => set('archived', e.target.checked)} /> Archived
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </form>
  )
}
