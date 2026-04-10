import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

/** PUT /api/admin/films/[filmId]/sections/[sectionId] — update a section */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ filmId: string; sectionId: string }> },
) {
  const { sectionId } = await params
  try {
    const { env } = getRequestContext()
    const body = await req.json() as { title?: string; description?: string; sort_order?: number }

    await env.DB.prepare(
      `UPDATE film_sections SET title = ?, description = ?, sort_order = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(
      body.title ?? null,
      body.description ?? null,
      body.sort_order ?? 0,
      Number(sectionId),
    ).run()

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

/** DELETE /api/admin/films/[filmId]/sections/[sectionId] — delete a section */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ filmId: string; sectionId: string }> },
) {
  const { sectionId } = await params
  try {
    const { env } = getRequestContext()
    await env.DB.prepare('DELETE FROM film_sections WHERE id = ?').bind(Number(sectionId)).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
