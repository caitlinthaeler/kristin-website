import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = await req.json() as Record<string, unknown>

    await env.DB.prepare(
      `UPDATE media SET
        filename = ?, title = ?, description = ?, type = ?,
        thumbnail = ?, created_date = ?, sort_order = ?,
        hidden = ?, archived = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(
        body.filename,
        body.title ?? null,
        body.description ?? null,
        body.type,
        body.thumbnail ?? null,
        body.created_date ?? null,
        body.sort_order ?? 0,
        body.hidden ? 1 : 0,
        body.archived ? 1 : 0,
        Number(id),
      )
      .run()

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(Number(id)).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
