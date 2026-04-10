import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// PUT — update a post (caption, hidden, sort_order)
// DELETE — remove a post
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = getRequestContext().env.DB
  const body = (await req.json()) as { caption?: string; hidden?: number; sort_order?: number }

  const sets: string[] = []
  const vals: unknown[] = []

  if (body.caption !== undefined) { sets.push('caption = ?'); vals.push(body.caption?.trim() || null) }
  if (body.hidden !== undefined) { sets.push('hidden = ?'); vals.push(body.hidden) }
  if (body.sort_order !== undefined) { sets.push('sort_order = ?'); vals.push(body.sort_order) }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  vals.push(id)
  await db.prepare(`UPDATE instagram_posts SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = getRequestContext().env.DB
  await db.prepare('DELETE FROM instagram_posts WHERE id = ?').bind(id).run()
  return NextResponse.json({ ok: true })
}
