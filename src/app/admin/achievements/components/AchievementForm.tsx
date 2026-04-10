'use client'

import { useState } from 'react'
import type { AchievementCategory } from '@/types'
import Field from '../../components/Field'
import { input, primaryBtn, ghostBtn } from '../../components/adminStyles'

const CATEGORIES: AchievementCategory[] = ['software', 'education', 'experience', 'event', 'collaboration', 'other']

export type AchievementFormData = {
  category: AchievementCategory
  title: string
  subtitle: string | null
  date_text: string | null
  hidden: boolean
  sort_order: number
}

interface Props {
  initial: AchievementFormData
  onSave: (data: AchievementFormData) => void
  onCancel: () => void
  saving: boolean
}

export default function AchievementForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<AchievementFormData>(initial)
  const set = (k: keyof AchievementFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Category *">
        <select className={input} value={form.category} onChange={(e) => set('category', e.target.value as AchievementCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Title *">
        <input required className={input} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Toon Boom Harmony" />
      </Field>
      <Field label="Subtitle" hint="role, institution, etc.">
        <input className={input} value={form.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value || null)} />
      </Field>
      <Field label="Date" hint="free text">
        <input className={input} value={form.date_text ?? ''} onChange={(e) => set('date_text', e.target.value || null)} placeholder="2020 – Present" />
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

export { CATEGORIES }
