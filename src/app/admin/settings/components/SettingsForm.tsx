'use client'

import { useEffect, useState } from 'react'
import type { ArtistInfo } from '@/types'
import Field from '../../components/Field'
import { input, primaryBtn } from '../../components/adminStyles'

const EMPTY: ArtistInfo = { name: '', penname: '', email: '', bio: '', resume_url: '', instagram_url: '', linkedin_url: '', featured_film: '' }

export default function SettingsForm() {
  const [form, setForm] = useState<ArtistInfo>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json() as Promise<ArtistInfo>)
      .then((d) => { setForm({ ...EMPTY, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const set = (k: keyof ArtistInfo, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null); setSaved(false)
    try {
      const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!r.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="space-y-4 max-w-xl">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <Field label="Display Name"><input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
      <Field label="Pen Name / Handle"><input className={input} value={form.penname} onChange={(e) => set('penname', e.target.value)} /></Field>
      <Field label="Contact Email"><input type="email" className={input} value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
      <Field label="Bio"><textarea className={`${input} resize-none`} rows={5} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Your artist bio…" /></Field>
      <Field label="Resume URL" hint="link to PDF"><input className={input} value={form.resume_url} onChange={(e) => set('resume_url', e.target.value)} /></Field>
      <Field label="Instagram URL"><input className={input} value={form.instagram_url} onChange={(e) => set('instagram_url', e.target.value)} placeholder="https://instagram.com/firresketches" /></Field>
      <Field label="LinkedIn URL"><input className={input} value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/…" /></Field>
      <Field label="Featured Film" hint="R2 key for home page"><input className={input} value={form.featured_film} onChange={(e) => set('featured_film', e.target.value)} placeholder="films/myvideo.mp4" /></Field>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {saved && <p className="text-success text-sm">Saved!</p>}
      <div className="pt-1">
        <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </div>
    </form>
  )
}
