import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// GET — list all curated instagram posts (admin view, includes hidden)
// POST — add a new post
export async function GET() {
  const db = getRequestContext().env.DB
  const { results } = await db
    .prepare('SELECT * FROM instagram_posts ORDER BY sort_order, created_at DESC')
    .all()
  return NextResponse.json(results ?? [])
}

export async function POST(req: Request) {
  const db = getRequestContext().env.DB
  const body = (await req.json()) as { url?: string; caption?: string }

  if (!body.url?.trim()) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  // Basic validation — must be an Instagram URL
  const url = body.url.trim()
  if (!url.includes('instagram.com/')) {
    return NextResponse.json({ error: 'Must be a valid Instagram URL' }, { status: 400 })
  }

  // Get next sort_order
  const last = await db
    .prepare('SELECT MAX(sort_order) as mx FROM instagram_posts')
    .first<{ mx: number | null }>()
  const nextOrder = (last?.mx ?? -1) + 1

  const result = await db
    .prepare('INSERT INTO instagram_posts (url, caption, sort_order) VALUES (?, ?, ?)')
    .bind(url, body.caption?.trim() || null, nextOrder)
    .run()

  return NextResponse.json({ id: result.meta.last_row_id, url, sort_order: nextOrder }, { status: 201 })
}
