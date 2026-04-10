import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      'SELECT * FROM project_sections WHERE project_id = ? ORDER BY sort_order ASC, id ASC'
    )
      .bind(Number(id))
      .all()
    return Response.json(result.results)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = (await req.json()) as Record<string, unknown>

    const result = await env.DB.prepare(
      `INSERT INTO project_sections (project_id, section_type, title, content, media_id, sort_order)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
    )
      .bind(
        Number(id),
        body.section_type ?? 'text',
        body.title ?? null,
        body.content ?? null,
        body.media_id ? Number(body.media_id) : null,
        body.sort_order ?? 0
      )
      .first()

    return Response.json(result, { status: 201 })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
