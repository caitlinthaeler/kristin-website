import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// GET /api/gallery?collection=ID|all&q=SEARCH&sort=newest|oldest|az|za&type=image,gif,...
export async function GET(req: Request) {
  const url = new URL(req.url)
  const collection = url.searchParams.get('collection') ?? 'all'
  const q = url.searchParams.get('q') ?? ''
  const sort = url.searchParams.get('sort') ?? 'newest'
  const typeParam = url.searchParams.get('type') ?? ''

  try {
    const { env } = getRequestContext()

    const parts: string[] = []
    const bindings: unknown[] = []

    if (collection === 'all' || !collection) {
      parts.push(`SELECT m.* FROM media m WHERE m.archived = 0 AND m.hidden = 0 AND m.type != 'film'`)
    } else {
      parts.push(
        `SELECT m.* FROM media m JOIN collection_media cm ON m.id = cm.media_id
         WHERE cm.collection_id = ? AND m.archived = 0 AND m.hidden = 0`,
      )
      bindings.push(collection)
    }

    if (q) {
      parts.push(`AND (m.title LIKE ? OR m.description LIKE ?)`)
      bindings.push(`%${q}%`, `%${q}%`)
    }

    if (typeParam) {
      const types = typeParam.split(',').map((t) => `'${t.trim()}'`).join(',')
      parts.push(`AND m.type IN (${types})`)
    }

    const orderMap: Record<string, string> = {
      newest: 'ORDER BY m.sort_order ASC, m.created_at DESC',
      oldest: 'ORDER BY m.sort_order ASC, m.created_at ASC',
      az:     'ORDER BY m.title ASC NULLS LAST',
      za:     'ORDER BY m.title DESC NULLS LAST',
    }
    parts.push(orderMap[sort] ?? orderMap.newest)
    parts.push('LIMIT 200')

    const sql = parts.join(' ')
    const stmt = env.DB.prepare(sql)
    const result = bindings.length
      ? await (stmt.bind(...bindings) as D1PreparedStatement).all()
      : await stmt.all()

    return Response.json(result.results ?? [])
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
