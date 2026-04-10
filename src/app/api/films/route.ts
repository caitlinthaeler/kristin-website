import { getRequestContext } from '@cloudflare/next-on-pages'
import { getFilms } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const ctx = getRequestContext()
    const films = await getFilms(ctx.env.DB)
    return Response.json(films)
  } catch (e) {
    // Outside Cloudflare runtime (e.g. `next dev`) — return empty list so the
    // UI renders gracefully instead of crashing.
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding') || msg.includes('not available')) {
      return Response.json([])
    }
    return Response.json({ error: 'Failed to fetch films' }, { status: 500 })
  }
}
