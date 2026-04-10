import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAnimations } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const ctx = getRequestContext()
    const animations = await getAnimations(ctx.env.DB)
    return Response.json(animations)
  } catch (e) {
    // Outside Cloudflare runtime (e.g. `next dev`) — return empty list so the
    // UI renders gracefully instead of crashing.
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding') || msg.includes('not available')) {
      return Response.json([])
    }
    return Response.json({ error: 'Failed to fetch animations' }, { status: 500 })
  }
}
