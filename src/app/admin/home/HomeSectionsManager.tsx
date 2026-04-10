'use client'

import { useEffect, useState } from 'react'
import type { HomeSection } from '@/types'
import Field from '../components/Field'
import { input, primaryBtn, ghostBtn } from '../components/adminStyles'

export default function HomeSectionsManager() {
  const [sections, setSections] = useState<HomeSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/home-sections')
      .then((r) => (r.ok ? (r.json() as Promise<HomeSection[]>) : Promise.reject()))
      .then((data) => { setSections(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave(section: HomeSection) {
    setSaving(true)
    setError(null)
    try {
      const r = await fetch(`/api/admin/home-sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: section.title,
          subtitle: section.subtitle,
          body: section.body,
          cta_label: section.cta_label,
          cta_href: section.cta_href,
          hidden: section.hidden ? 1 : 0,
          sort_order: section.sort_order,
        }),
      })
      if (!r.ok) throw new Error('Failed to save')
      setEditing(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  function update(id: number, key: keyof HomeSection, value: unknown) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    )
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Home Page</h1>
        <p className="text-sm text-muted mb-8">Manage hero, grid, and CTA sections.</p>
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Home Page</h1>
      <p className="text-sm text-muted mb-8">Edit sections shown on the homepage. Drag to reorder (sort_order), toggle visibility.</p>
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {sections.map((s) => (
          <div
            key={s.id}
            className={`border rounded-xl p-5 transition-colors ${
              s.hidden ? 'border-border/30 bg-surface/30 opacity-60' : 'border-border/40 bg-background'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm text-foreground">{s.label}</h3>
                <span className="text-[10px] tracking-[0.15em] uppercase text-muted bg-surface px-2 py-0.5 rounded-full">
                  {s.section_key}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!s.hidden}
                    onChange={(e) => {
                      update(s.id, 'hidden', !e.target.checked)
                    }}
                    className="rounded border-border text-primary focus:ring-primary/40"
                  />
                  Visible
                </label>
                <button
                  onClick={() => setEditing(editing === s.id ? null : s.id)}
                  className="text-xs text-primary hover:underline"
                >
                  {editing === s.id ? 'Collapse' : 'Edit'}
                </button>
              </div>
            </div>

            {editing === s.id && (
              <div className="space-y-4 mt-4 pt-4 border-t border-border/20">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Title (optional)">
                    <input className={input} value={s.title ?? ''} onChange={(e) => update(s.id, 'title', e.target.value || null)} />
                  </Field>
                  <Field label="Subtitle (optional)">
                    <input className={input} value={s.subtitle ?? ''} onChange={(e) => update(s.id, 'subtitle', e.target.value || null)} />
                  </Field>
                </div>
                <Field label="Body (optional)">
                  <textarea
                    className={`${input} resize-none`}
                    rows={4}
                    value={s.body ?? ''}
                    onChange={(e) => update(s.id, 'body', e.target.value || null)}
                    placeholder="Markdown / plain text…"
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="CTA Label">
                    <input className={input} value={s.cta_label ?? ''} onChange={(e) => update(s.id, 'cta_label', e.target.value || null)} placeholder="e.g. View Films" />
                  </Field>
                  <Field label="CTA Link">
                    <input className={input} value={s.cta_href ?? ''} onChange={(e) => update(s.id, 'cta_href', e.target.value || null)} placeholder="/films" />
                  </Field>
                </div>
                <Field label="Sort Order">
                  <input
                    type="number"
                    className={`${input} w-24`}
                    value={s.sort_order}
                    onChange={(e) => update(s.id, 'sort_order', parseInt(e.target.value) || 0)}
                  />
                </Field>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleSave(s)}
                    disabled={saving}
                    className={primaryBtn}
                  >
                    {saving ? 'Saving…' : 'Save Section'}
                  </button>
                  <button onClick={() => setEditing(null)} className={ghostBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
