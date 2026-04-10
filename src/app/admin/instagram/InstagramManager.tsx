'use client'

import { useCallback, useEffect, useState } from 'react'
import { input, primaryBtn, ghostBtn, rowBtn } from '../components/adminStyles'

interface InstaPost {
  id: number
  url: string
  caption: string | null
  hidden: number
  sort_order: number
  created_at: string
}

export default function InstagramManager() {
  const [posts, setPosts] = useState<InstaPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/instagram')
      .then((r) => r.json() as Promise<InstaPost[]>)
      .then((d) => { setPosts(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newUrl.trim()) return
    setAdding(true)
    setError('')

    const res = await fetch('/api/admin/instagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl.trim(), caption: newCaption.trim() || null }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string }).error ?? 'Failed to add post')
      setAdding(false)
      return
    }

    setNewUrl('')
    setNewCaption('')
    setAdding(false)
    load()
  }

  async function toggleHidden(post: InstaPost) {
    await fetch(`/api/admin/instagram/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: post.hidden ? 0 : 1 }),
    })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Remove this post?')) return
    await fetch(`/api/admin/instagram/${id}`, { method: 'DELETE' })
    load()
  }

  async function movePost(post: InstaPost, direction: 'up' | 'down') {
    const idx = posts.findIndex((p) => p.id === post.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= posts.length) return

    const other = posts[swapIdx]
    await Promise.all([
      fetch(`/api/admin/instagram/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: other.sort_order }),
      }),
      fetch(`/api/admin/instagram/${other.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: post.sort_order }),
      }),
    ])
    load()
  }

  // Extract shortcode from URL for preview
  function getShortcode(url: string): string | null {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/)
    return match ? match[1] : null
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Instagram Posts</h1>
        <p className="text-sm text-muted mt-0.5">
          Curate which Instagram posts appear on the site. Paste any Instagram post or reel URL.
        </p>
      </div>

      {/* Add new post */}
      <form onSubmit={handleAdd} className="bg-surface border border-border rounded-xl p-4 mb-6 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Instagram URL</label>
          <input
            className={input}
            placeholder="https://www.instagram.com/p/ABC123..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Caption / Note (optional, admin only)</label>
          <input
            className={input}
            placeholder="e.g. Character study post"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" disabled={adding || !newUrl.trim()} className={primaryBtn}>
          {adding ? 'Adding…' : '+ Add Post'}
        </button>
      </form>

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">No posts added yet. Paste an Instagram URL above to get started.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post, idx) => {
            const shortcode = getShortcode(post.url)
            return (
              <div
                key={post.id}
                className={`bg-surface border border-border rounded-xl p-4 transition-opacity ${
                  post.hidden ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail preview */}
                  {shortcode && (
                    <div className="w-16 h-16 shrink-0 bg-background border border-border overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.instagram.com/p/${shortcode}/media/?size=t`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-primary transition-colors break-all line-clamp-1"
                    >
                      {post.url}
                    </a>
                    {post.caption && (
                      <p className="text-xs text-muted mt-0.5">{post.caption}</p>
                    )}
                    <p className="text-[10px] text-muted/50 mt-1">
                      Order: {post.sort_order} · {post.hidden ? 'Hidden' : 'Visible'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => movePost(post, 'up')}
                      disabled={idx === 0}
                      className={`${rowBtn} disabled:opacity-30`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => movePost(post, 'down')}
                      disabled={idx === posts.length - 1}
                      className={`${rowBtn} disabled:opacity-30`}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button onClick={() => toggleHidden(post)} className={rowBtn}>
                      {post.hidden ? 'Show' : 'Hide'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-destructive hover:text-destructive/70 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
