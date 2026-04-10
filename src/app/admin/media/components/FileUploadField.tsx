'use client'

import { useRef, useState } from 'react'
import { r2url, isImage } from '@/lib/r2'

interface Props {
  label: string
  folder: string
  accept?: string
  value: string | null
  onChange: (key: string | null) => void
  hint?: string
}

export default function FileUploadField({ label, folder, accept, value, onChange, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json() as { key?: string; error?: string }
      if (!res.ok || !json.key) throw new Error(json.error ?? 'Upload failed')
      onChange(json.key)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const previewUrl = value && (isImage(value) || value.endsWith('.gif')) ? r2url(value) : null

  return (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
        {label}
        {hint && <span className="font-normal normal-case ml-1 text-muted/60">— {hint}</span>}
      </label>

      {/* Current file indicator */}
      {value ? (
        <div className="flex items-center gap-3 mb-2 p-2.5 rounded-lg bg-surface border border-border">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-10 w-16 object-cover rounded shrink-0" />
          )}
          <span className="text-xs text-muted font-mono truncate flex-1 min-w-0">{value}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="shrink-0 text-xs text-muted hover:text-destructive transition-colors px-1"
            title="Remove file"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="mb-2 p-2.5 rounded-lg bg-surface border border-dashed border-border text-xs text-muted">
          No file uploaded
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface text-foreground hover:text-primary transition-colors disabled:opacity-50 font-medium"
      >
        {uploading ? (
          <span className="flex items-center gap-1.5">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 20v-2a8 8 0 01-8-8z" />
            </svg>
            Uploading…
          </span>
        ) : value ? '↺ Replace file' : '↑ Upload file'}
      </button>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}
