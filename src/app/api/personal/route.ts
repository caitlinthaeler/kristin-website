import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    // Personal page shows images and life drawings
    const result = await env.DB.prepare(
      `SELECT * FROM media
       WHERE type IN ('image', 'life-drawing')
         AND archived = 0 AND hidden = 0
       ORDER BY sort_order ASC, created_at DESC`
    ).all()
    return Response.json(result.results ?? [])
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
