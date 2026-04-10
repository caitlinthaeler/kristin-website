import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = await req.json() as Record<string, unknown>

    await env.DB.prepare(
      `UPDATE achievements SET
        category = ?, title = ?, subtitle = ?, date_text = ?, hidden = ?, sort_order = ?
       WHERE id = ?`
    )
      .bind(
        body.category,
        body.title,
        body.subtitle ?? null,
        body.date_text ?? null,
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
    await env.DB.prepare('DELETE FROM achievements WHERE id = ?').bind(Number(id)).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
