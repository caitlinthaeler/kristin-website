import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type Ctx = { params: Promise<{ id: string }> }

/** GET — list media IDs in this collection */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      `SELECT m.* FROM media m
       JOIN collection_media cm ON cm.media_id = m.id
       WHERE cm.collection_id = ?
       ORDER BY m.sort_order ASC, m.id DESC`
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

/** POST — add media to collection. Body: { media_ids: number[] } */
export async function POST(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = (await req.json()) as { media_ids?: number[] }

    if (!body.media_ids?.length) return Response.json({ error: 'media_ids required' }, { status: 400 })

    const stmts = body.media_ids.map((mid) =>
      env.DB.prepare('INSERT OR IGNORE INTO collection_media (collection_id, media_id) VALUES (?, ?)')
        .bind(Number(id), mid)
    )
    await env.DB.batch(stmts)

    return Response.json({ ok: true, added: body.media_ids.length })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

/** DELETE — remove media from collection. Body: { media_ids: number[] } */
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const body = (await req.json()) as { media_ids?: number[] }

    if (!body.media_ids?.length) return Response.json({ error: 'media_ids required' }, { status: 400 })

    const stmts = body.media_ids.map((mid) =>
      env.DB.prepare('DELETE FROM collection_media WHERE collection_id = ? AND media_id = ?')
        .bind(Number(id), mid)
    )
    await env.DB.batch(stmts)

    return Response.json({ ok: true, removed: body.media_ids.length })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
