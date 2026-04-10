import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      'SELECT * FROM home_sections ORDER BY sort_order ASC, id ASC',
    ).all()
    return Response.json(result.results ?? [])
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext()
    const body = (await req.json()) as { section_key: string; label: string }

    if (!body.section_key || !body.label) {
      return Response.json({ error: 'section_key and label are required' }, { status: 400 })
    }

    // Get next sort_order
    const last = await env.DB.prepare(
      'SELECT MAX(sort_order) as mx FROM home_sections',
    ).first<{ mx: number | null }>()
    const nextOrder = (last?.mx ?? -1) + 1

    const result = await env.DB.prepare(
      'INSERT INTO home_sections (section_key, label, sort_order) VALUES (?, ?, ?)',
    )
      .bind(body.section_key, body.label, nextOrder)
      .run()

    return Response.json({ id: result.meta.last_row_id }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('UNIQUE')) {
      return Response.json({ error: 'A section with that key already exists' }, { status: 409 })
    }
    return Response.json({ error: msg }, { status: 500 })
  }
}
