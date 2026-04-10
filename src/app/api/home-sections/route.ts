import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// Public: returns visible home sections ordered by sort_order
export async function GET() {
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      `SELECT hs.*, m.filename AS media_filename, m.title AS media_title, m.thumbnail AS media_thumbnail
       FROM home_sections hs
       LEFT JOIN media m ON hs.media_id = m.id
       WHERE hs.hidden = 0
       ORDER BY hs.sort_order ASC, hs.id ASC`,
    ).all()
    return Response.json(result.results ?? [])
  } catch {
    return Response.json([])
  }
}
