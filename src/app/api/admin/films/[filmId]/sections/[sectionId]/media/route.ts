import { getRequestContext } from '@cloudflare/next-on-pages'
import type { Media } from '@/types'

export const runtime = 'edge'

/** GET — list media in a film section */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filmId: string; sectionId: string }> },
) {
  const { sectionId } = await params
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      `SELECT m.* FROM media m
       JOIN film_section_media fsm ON fsm.media_id = m.id
       WHERE fsm.section_id = ?
       ORDER BY fsm.sort_order ASC, m.id ASC`
    ).bind(sectionId).all<Media>()
    return Response.json(result.results)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

/** POST — add media to a film section. Body: { media_ids: number[] } */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ filmId: string; sectionId: string }> },
) {
  const { sectionId } = await params
  try {
    const { env } = getRequestContext()
    const { media_ids } = await req.json() as { media_ids: number[] }
    if (!Array.isArray(media_ids) || media_ids.length === 0) {
      return Response.json({ error: 'media_ids required' }, { status: 400 })
    }

    const stmt = env.DB.prepare(
      'INSERT OR IGNORE INTO film_section_media (section_id, media_id, sort_order) VALUES (?, ?, ?)'
    )
    await env.DB.batch(
      media_ids.map((id, i) => stmt.bind(Number(sectionId), id, i))
    )

    return Response.json({ ok: true }, { status: 201 })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

/** DELETE — remove media from a film section. Body: { media_ids: number[] } */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ filmId: string; sectionId: string }> },
) {
  const { sectionId } = await params
  try {
    const { env } = getRequestContext()
    const { media_ids } = await req.json() as { media_ids: number[] }

    const stmt = env.DB.prepare(
      'DELETE FROM film_section_media WHERE section_id = ? AND media_id = ?'
    )
    await env.DB.batch(
      media_ids.map((id) => stmt.bind(Number(sectionId), id))
    )

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
