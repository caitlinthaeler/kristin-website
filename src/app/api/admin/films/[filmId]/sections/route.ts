import { getRequestContext } from '@cloudflare/next-on-pages'
import type { FilmSection } from '@/types'

export const runtime = 'edge'

/** GET /api/admin/films/[filmId]/sections — list sections for a film */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filmId: string }> },
) {
  const { filmId } = await params
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      'SELECT * FROM film_sections WHERE film_id = ? ORDER BY sort_order ASC, id ASC'
    ).bind(filmId).all<FilmSection>()
    return Response.json(result.results)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

/** POST /api/admin/films/[filmId]/sections — create a new section */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ filmId: string }> },
) {
  const { filmId } = await params
  try {
    const { env } = getRequestContext()
    const body = await req.json() as { title?: string; description?: string; sort_order?: number }

    const result = await env.DB.prepare(
      `INSERT INTO film_sections (film_id, title, description, sort_order)
       VALUES (?, ?, ?, ?)
       RETURNING *`
    ).bind(
      Number(filmId),
      body.title ?? null,
      body.description ?? null,
      body.sort_order ?? 0,
    ).first()

    return Response.json(result, { status: 201 })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
