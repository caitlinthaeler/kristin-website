'use client'

import { useEffect, useState } from 'react'
import type { ArtistInfo } from '@/types'
import { r2url } from '@/lib/r2'
import Field from '../../components/Field'
import { input, primaryBtn } from '../../components/adminStyles'

const EMPTY: ArtistInfo = {
  name: '', penname: '', email: '', bio: '', resume_url: '',
  instagram_url: '', linkedin_url: '', featured_film: '',
  profile_picture: '', logo_type: 'text', logo_image: '',
}

function ImageUploadField({
  label, hint, value, folder, onChange,
}: {
  label: string
  hint?: string
  value: string
  folder: string
  onChange: (key: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!r.ok) throw new Error('Upload failed')
      const { key } = (await r.json()) as { key: string }
      onChange(key)
    } catch { /* fail silently */ }
    finally { setUploading(false) }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-4">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r2url(value)}
            alt={label}
            className="w-16 h-16 rounded-lg object-cover border border-border bg-surface"
          />
        )}
        <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-surface transition-colors">
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-destructive hover:underline"
          >
            Remove
          </button>
        )}
      </div>
    </Field>
  )
}

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
      {/* Profile & Logo */}
      <div className="p-4 rounded-xl bg-surface/50 border border-border/30 space-y-5">
        <p className="text-xs tracking-[0.15em] uppercase text-muted font-semibold">Branding</p>
        <ImageUploadField label="Profile Picture" value={form.profile_picture} folder="profile" onChange={(v) => set('profile_picture', v)} />
        <Field label="Logo Type">
          <select
            className={input}
            value={form.logo_type}
            onChange={(e) => set('logo_type', e.target.value)}
          >
            <option value="text">Text (Name + Handle)</option>
            <option value="image">Image / Icon</option>
          </select>
        </Field>
        {form.logo_type === 'image' && (
          <ImageUploadField label="Logo Image" hint="Square PNG recommended" value={form.logo_image} folder="brand" onChange={(v) => set('logo_image', v)} />
        )}
      </div>

      {/* Identity */}
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
