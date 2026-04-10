'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Post {
  id: number
  url: string
  caption: string | null
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json() as Promise<Post[]>)
      .then((d) => {
        setPosts(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Load Instagram embed.js once posts are rendered
  useEffect(() => {
    if (posts.length === 0) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    if (win.instgrm) {
      win.instgrm.Embeds.process()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  }, [posts])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted text-sm">No posts to show yet.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: (idx % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={normalizeUrl(post.url)}
            data-instgrm-version="14"
            style={{
              background: 'transparent',
              border: 0,
              margin: 0,
              padding: 0,
              width: '100%',
              maxWidth: '540px',
            }}
          >
            <a href={normalizeUrl(post.url)} target="_blank" rel="noopener noreferrer">
              View on Instagram
            </a>
          </blockquote>
        </motion.div>
      ))}
    </div>
  )
}

/** Ensure URL has trailing slash and utm params for embed.js to pick up */
function normalizeUrl(url: string): string {
  let clean = url.split('?')[0]
  if (!clean.endsWith('/')) clean += '/'
  return clean + '?utm_source=ig_embed'
}
