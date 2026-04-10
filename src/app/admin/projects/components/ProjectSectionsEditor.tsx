'use client'

import { useEffect, useState, useCallback } from 'react'
import type { ProjectSection, ProjectSectionType } from '@/types'
import { input, primaryBtn, ghostBtn } from '../../components/adminStyles'
import Field from '../../components/Field'

interface Props {
  projectId: number
  onClose: () => void
}

const TYPE_LABELS: Record<ProjectSectionType, string> = {
  text: 'Text',
  media: 'Media',
  gallery: 'Gallery',
}

export default function ProjectSectionsEditor({ projectId, onClose }: Props) {
  const [sections, setSections] = useState<ProjectSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<ProjectSection>>({})

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/projects/${projectId}/sections`)
      .then((r) => r.json() as Promise<ProjectSection[]>)
      .then((d) => { setSections(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [projectId])

  useEffect(() => { load() }, [load])

  function startEdit(s: ProjectSection) {
    setEditId(s.id)
    setDraft({ section_type: s.section_type, title: s.title, content: s.content, media_id: s.media_id, sort_order: s.sort_order })
  }

  function startAdd() {
    setEditId(-1)
    setDraft({ section_type: 'text', title: '', content: '', media_id: null, sort_order: sections.length })
  }

  async function save() {
    if (editId === null) return
    setSaving(editId)
    try {
      if (editId === -1) {
        await fetch(`/api/admin/projects/${projectId}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
      } else {
        await fetch(`/api/admin/projects/${projectId}/sections/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
      }
      setEditId(null)
      setDraft({})
      load()
    } finally {
      setSaving(null)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this section?')) return
    await fetch(`/api/admin/projects/${projectId}/sections/${id}`, { method: 'DELETE' })
    load()
  }

  const set = (k: string, v: unknown) => setDraft((d) => ({ ...d, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Project Sections</h3>
        <div className="flex gap-2">
          <button onClick={startAdd} className={primaryBtn}>+ Add Section</button>
          <button onClick={onClose} className={ghostBtn}>Close</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
        </div>
      ) : sections.length === 0 && editId !== -1 ? (
        <p className="text-sm text-muted">No sections yet. Add one to build this project page.</p>
      ) : null}

      <div className="space-y-2">
        {sections.map((s) => (
          <div key={s.id} className="border border-border rounded-lg overflow-hidden">
            {editId === s.id ? (
              <SectionForm
                draft={draft}
                set={set}
                onSave={save}
                onCancel={() => { setEditId(null); setDraft({}) }}
                saving={saving === s.id}
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {TYPE_LABELS[s.section_type as ProjectSectionType] ?? s.section_type}
                </span>
                <span className="text-sm font-medium text-foreground truncate flex-1">
                  {s.title || <span className="text-muted italic">Untitled</span>}
                </span>
                <span className="text-xs text-muted">#{s.sort_order}</span>
                <button onClick={() => startEdit(s)} className="text-xs text-muted hover:text-foreground transition-colors">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-xs text-destructive hover:text-destructive/70 transition-colors">Delete</button>
              </div>
            )}
          </div>
        ))}

        {editId === -1 && (
          <div className="border border-primary/30 rounded-lg overflow-hidden">
            <SectionForm
              draft={draft}
              set={set}
              onSave={save}
              onCancel={() => { setEditId(null); setDraft({}) }}
              saving={saving === -1}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function SectionForm({
  draft,
  set,
  onSave,
  onCancel,
  saving,
}: {
  draft: Partial<ProjectSection>
  set: (k: string, v: unknown) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  return (
    <div className="px-4 py-4 space-y-3 bg-surface">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <select
            className={input}
            value={draft.section_type ?? 'text'}
            onChange={(e) => set('section_type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="media">Media</option>
            <option value="gallery">Gallery</option>
          </select>
        </Field>
        <Field label="Sort Order">
          <input
            type="number"
            className={input}
            value={draft.sort_order ?? 0}
            onChange={(e) => set('sort_order', Number(e.target.value))}
          />
        </Field>
      </div>
      <Field label="Title">
        <input
          className={input}
          value={draft.title ?? ''}
          onChange={(e) => set('title', e.target.value || null)}
          placeholder="Section title"
        />
      </Field>
      {(draft.section_type === 'text' || !draft.section_type) && (
        <Field label="Content">
          <textarea
            className={`${input} resize-none`}
            rows={4}
            value={draft.content ?? ''}
            onChange={(e) => set('content', e.target.value || null)}
            placeholder="Text content or markdown…"
          />
        </Field>
      )}
      {draft.section_type === 'media' && (
        <Field label="Media ID" hint="ID from media library">
          <input
            type="number"
            className={input}
            value={draft.media_id ?? ''}
            onChange={(e) => set('media_id', e.target.value ? Number(e.target.value) : null)}
            placeholder="e.g. 5"
          />
        </Field>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={saving} className={primaryBtn}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </div>
  )
}
