import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string; sectionId: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { sectionId } = await params
    const { env } = getRequestContext()
    const body = (await req.json()) as Record<string, unknown>

    await env.DB.prepare(
      `UPDATE project_sections SET
        section_type = ?, title = ?, content = ?, media_id = ?, sort_order = ?,
        updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(
        body.section_type ?? 'text',
        body.title ?? null,
        body.content ?? null,
        body.media_id ? Number(body.media_id) : null,
        body.sort_order ?? 0,
        Number(sectionId)
      )
      .run()

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { sectionId } = await params
    const { env } = getRequestContext()
    await env.DB.prepare('DELETE FROM project_sections WHERE id = ?')
      .bind(Number(sectionId))
      .run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
