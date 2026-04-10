'use client'

import { useState } from 'react'
import type { ServiceContentType } from '@/types'
import Field from '../../components/Field'
import { input, primaryBtn, ghostBtn } from '../../components/adminStyles'

const CONTENT_TYPES: ServiceContentType[] = ['text', 'pdf', 'image', 'instagram']

export type ServiceFormData = {
  title: string
  description: string | null
  price_info: string | null
  content_type: ServiceContentType
  content_url: string | null
  hidden: boolean
  sort_order: number
}

interface Props {
  initial: ServiceFormData
  onSave: (data: ServiceFormData) => void
  onCancel: () => void
  saving: boolean
}

export default function ServiceForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<ServiceFormData>(initial)
  const set = (k: keyof ServiceFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Title *">
        <input required className={input} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Character Animation" />
      </Field>
      <Field label="Description">
        <textarea className={`${input} resize-none`} rows={4} value={form.description ?? ''} onChange={(e) => set('description', e.target.value || null)} />
      </Field>
      <Field label="Pricing Info" hint="free text">
        <input className={input} value={form.price_info ?? ''} onChange={(e) => set('price_info', e.target.value || null)} placeholder="Starting at $X / enquire for pricing" />
      </Field>
      <Field label="Content Type">
        <select className={input} value={form.content_type} onChange={(e) => set('content_type', e.target.value as ServiceContentType)}>
          {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      {form.content_type !== 'text' && (
        <Field label="Content URL / R2 Key">
          <input className={input} value={form.content_url ?? ''} onChange={(e) => set('content_url', e.target.value || null)} />
        </Field>
      )}
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
