import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const { env } = getRequestContext()
    const body = (await req.json()) as Record<string, unknown>

    const allowed = ['title', 'subtitle', 'body', 'cta_label', 'cta_href', 'media_id', 'hidden', 'sort_order']
    const sets: string[] = []
    const vals: unknown[] = []

    for (const k of allowed) {
      if (body[k] !== undefined) {
        sets.push(`${k} = ?`)
        vals.push(body[k])
      }
    }
    sets.push("updated_at = datetime('now')")

    if (sets.length === 1) return Response.json({ ok: true })

    vals.push(id)
    await env.DB.prepare(`UPDATE home_sections SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
