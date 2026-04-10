import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const result = await env.DB.prepare(
      'SELECT id, title, description, parent_id, sort_order FROM collections WHERE hidden = 0 ORDER BY sort_order, title',
    ).all()
    return Response.json(result.results ?? [])
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json([])
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
