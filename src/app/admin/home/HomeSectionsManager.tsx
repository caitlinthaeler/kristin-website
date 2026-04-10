'use client'

import { useCallback, useEffect, useState } from 'react'
import type { HomeSection, Media } from '@/types'
import { r2url, isVideo } from '@/lib/r2'
import Field from '../components/Field'
import Modal from '../components/Modal'
import MediaPicker from '../components/MediaPicker'
import { input, primaryBtn, ghostBtn, rowBtn } from '../components/adminStyles'

/* ── Section templates ────────────────────────────────────────────── */

const TEMPLATES = [
  { key: 'hero', label: 'Hero / Featured Film', description: 'Full-width hero with featured video, heading, subtitle, and CTA buttons' },
  { key: 'portfolio_grid', label: 'Portfolio Grid', description: 'Category cards linking to Animations, Films, Personal, etc.' },
  { key: 'about_teaser', label: 'About Teaser', description: 'Quote block + portrait placeholder with Learn More link' },
  { key: 'commission_cta', label: 'Commission / Hire Me CTA', description: 'Call-to-action section for commissions and freelance work' },
] as const

/* ── Main component ───────────────────────────────────────────────── */

export default function HomeSectionsManager() {
  const [sections, setSections] = useState<HomeSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/home-sections')
      .then((r) => r.json() as Promise<HomeSection[]>)
      .then((data) => { setSections(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  /* ── CRUD ── */

  async function handleAddSection(key: string, label: string) {
    setSaving(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/home-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_key: key, label }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? 'Failed to add')
      }
      setShowAdd(false)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

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
          media_id: section.media_id,
          hidden: section.hidden ? 1 : 0,
          sort_order: section.sort_order,
        }),
      })
      if (!r.ok) throw new Error('Failed to save')
      setEditing(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this section from the home page?')) return
    await fetch(`/api/admin/home-sections/${id}`, { method: 'DELETE' })
    load()
  }

  async function handleMove(section: HomeSection, direction: 'up' | 'down') {
    const idx = sections.findIndex((s) => s.id === section.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sections.length) return

    const other = sections[swapIdx]
    await Promise.all([
      fetch(`/api/admin/home-sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: other.sort_order }),
      }),
      fetch(`/api/admin/home-sections/${other.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: section.sort_order }),
      }),
    ])
    load()
  }

  function update(id: number, key: keyof HomeSection, value: unknown) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    )
  }

  /* ── Keys already in use ── */
  const usedKeys = new Set(sections.map((s) => s.section_key))

  /* ── Render ── */

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Home Page</h1>
        <p className="text-sm text-muted mb-8">Manage sections displayed on the homepage.</p>
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Home Page</h1>
          <p className="text-sm text-muted">Add, remove, reorder and edit sections. Only visible sections show on the site.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ Add Section</button>
      </div>

      {error && <p className="text-destructive text-sm mb-4">{error}</p>}

      {sections.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted text-sm mb-3">No sections on the homepage yet.</p>
          <button onClick={() => setShowAdd(true)} className={primaryBtn}>+ Add Section</button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((s, idx) => (
            <div
              key={s.id}
              className={`border rounded-xl p-5 transition-colors ${
                s.hidden ? 'border-border/30 bg-surface/30 opacity-60' : 'border-border/40 bg-background'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMove(s, 'up')}
                      disabled={idx === 0}
                      className={`${rowBtn} disabled:opacity-20 text-base leading-none`}
                      title="Move up"
                    >↑</button>
                    <button
                      onClick={() => handleMove(s, 'down')}
                      disabled={idx === sections.length - 1}
                      className={`${rowBtn} disabled:opacity-20 text-base leading-none`}
                      title="Move down"
                    >↓</button>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground">{s.label}</h3>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted">
                      {s.section_key}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!s.hidden}
                      onChange={(e) => {
                        const updated = { ...s, hidden: !e.target.checked }
                        handleSave(updated)
                      }}
                      className="rounded border-border text-primary focus:ring-primary/40"
                    />
                    Visible
                  </label>
                  <button
                    onClick={() => setEditing(editing === s.id ? null : s.id)}
                    className={rowBtn}
                  >
                    {editing === s.id ? 'Collapse' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs text-destructive hover:text-destructive/70 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded edit form */}
              {editing === s.id && (
                <SectionEditor
                  section={s}
                  onUpdate={(key, value) => update(s.id, key, value)}
                  onSave={() => handleSave(s)}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add section modal */}
      {showAdd && (
        <Modal title="Add Section" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <p className="text-sm text-muted mb-4">Choose a section template to add to the homepage.</p>
            {TEMPLATES.map((t) => {
              const used = usedKeys.has(t.key)
              return (
                <button
                  key={t.key}
                  disabled={used || saving}
                  onClick={() => handleAddSection(t.key, t.label)}
                  className={`w-full text-left p-4 border rounded-xl transition-colors ${
                    used
                      ? 'border-border/20 bg-surface/30 opacity-40 cursor-not-allowed'
                      : 'border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                  }`}
                >
                  <p className="font-semibold text-sm text-foreground">{t.label}</p>
                  <p className="text-xs text-muted mt-0.5">{t.description}</p>
                  {used && <p className="text-[10px] text-muted mt-1">Already added</p>}
                </button>
              )
            })}
            <div className="pt-2">
              <button onClick={() => setShowAdd(false)} className={ghostBtn}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ── Section Editor ───────────────────────────────────────────────── */

function SectionEditor({
  section,
  onUpdate,
  onSave,
  onCancel,
  saving,
}: {
  section: HomeSection
  onUpdate: (key: keyof HomeSection, value: unknown) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [linkedMedia, setLinkedMedia] = useState<Media | null>(null)

  // Load linked media info
  useEffect(() => {
    if (!section.media_id) { setLinkedMedia(null); return }
    fetch(`/api/media/${section.media_id}`)
      .then((r) => r.ok ? r.json() as Promise<Media> : null)
      .then((m) => setLinkedMedia(m ?? null))
      .catch(() => setLinkedMedia(null))
  }, [section.media_id])

  const isHero = section.section_key === 'hero'

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-border/20">
      {/* Media picker for Hero section */}
      {isHero && (
        <div>
          <Field label="Featured Film / Media" hint="The video or image displayed in the hero section">
            {linkedMedia ? (
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="w-20 h-14 shrink-0 bg-surface overflow-hidden">
                  {isVideo(linkedMedia.filename) ? (
                    <video src={r2url(linkedMedia.filename)} className="w-full h-full object-cover" muted preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r2url(linkedMedia.thumbnail ?? linkedMedia.filename)} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{linkedMedia.title ?? linkedMedia.filename}</p>
                  <p className="text-[10px] text-muted">ID: {linkedMedia.id}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setShowMediaPicker(true)} className={rowBtn}>Change</button>
                  <button
                    onClick={() => { onUpdate('media_id', null); setLinkedMedia(null) }}
                    className="text-xs text-destructive hover:text-destructive/70 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowMediaPicker(true)}
                className={`w-full p-4 border border-dashed border-border rounded-lg text-sm text-muted hover:border-primary/40 hover:text-foreground transition-colors`}
              >
                + Select featured media
              </button>
            )}
          </Field>
          {showMediaPicker && (
            <Modal title="Select Featured Media" onClose={() => setShowMediaPicker(false)}>
              <MediaPicker
                onSelect={(media) => {
                  if (media.length > 0) {
                    onUpdate('media_id', media[0].id)
                    setLinkedMedia(media[0])
                  }
                  setShowMediaPicker(false)
                }}
                filterType="film"
              />
            </Modal>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title">
          <input className={input} value={section.title ?? ''} onChange={(e) => onUpdate('title', e.target.value || null)} placeholder="Section heading" />
        </Field>
        <Field label="Subtitle">
          <input className={input} value={section.subtitle ?? ''} onChange={(e) => onUpdate('subtitle', e.target.value || null)} placeholder="Subtitle text" />
        </Field>
      </div>
      <Field label="Body">
        <textarea
          className={`${input} resize-none`}
          rows={4}
          value={section.body ?? ''}
          onChange={(e) => onUpdate('body', e.target.value || null)}
          placeholder="Body text / paragraph…"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="CTA Label">
          <input className={input} value={section.cta_label ?? ''} onChange={(e) => onUpdate('cta_label', e.target.value || null)} placeholder="e.g. View Films" />
        </Field>
        <Field label="CTA Link">
          <input className={input} value={section.cta_href ?? ''} onChange={(e) => onUpdate('cta_href', e.target.value || null)} placeholder="/films" />
        </Field>
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} disabled={saving} className={primaryBtn}>
          {saving ? 'Saving…' : 'Save Section'}
        </button>
        <button onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </div>
  )
}
