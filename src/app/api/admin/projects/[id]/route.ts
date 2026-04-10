import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = await req.json() as Record<string, unknown>

    await env.DB.prepare(
      `UPDATE projects SET
        title = ?, description = ?, thumbnail = ?, hidden = ?, sort_order = ?,
        updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(
        body.title,
        body.description ?? null,
        body.thumbnail ?? null,
        body.hidden ? 1 : 0,
        body.sort_order ?? 0,
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
    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(Number(id)).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
