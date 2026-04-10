import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllMediaAdmin } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const media = await getAllMediaAdmin(env.DB)
    return Response.json(media)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext()
    const body = await req.json() as {
      filename: string
      title?: string
      description?: string
      type: string
      thumbnail?: string
      created_date?: string
      sort_order?: number
      hidden?: boolean
      archived?: boolean
    }

    if (!body.filename || !body.type) {
      return Response.json({ error: 'filename and type required' }, { status: 400 })
    }

    const result = await env.DB.prepare(
      `INSERT INTO media (filename, title, description, type, thumbnail, created_date, sort_order, hidden, archived)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
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
      )
      .first()

    return Response.json(result, { status: 201 })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
