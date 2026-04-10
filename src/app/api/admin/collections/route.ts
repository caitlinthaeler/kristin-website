import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      'SELECT * FROM collections ORDER BY sort_order ASC, title ASC'
    ).all()
    return Response.json(result.results)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext()
    const body = (await req.json()) as Record<string, unknown>

    if (!body.title) return Response.json({ error: 'title required' }, { status: 400 })

    const result = await env.DB.prepare(
      `INSERT INTO collections (title, description, parent_id, hidden, sort_order)
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
      .bind(
        body.title,
        body.description ?? null,
        body.parent_id ? Number(body.parent_id) : null,
        body.hidden ? 1 : 0,
        body.sort_order ?? 0
      )
      .first()

    return Response.json(result, { status: 201 })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
