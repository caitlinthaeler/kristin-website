import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// GET — list visible instagram posts (public)
export async function GET() {
  try {
    const db = getRequestContext().env.DB
    const { results } = await db
      .prepare('SELECT id, url, caption FROM instagram_posts WHERE hidden = 0 ORDER BY sort_order, created_at DESC')
      .all()
    return NextResponse.json(results ?? [])
  } catch {
    return NextResponse.json([])
  }
}
