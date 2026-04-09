import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAnimations } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const animations = await getAnimations(env.DB)
    return Response.json(animations)
  } catch {
    return Response.json({ error: 'Failed to fetch animations' }, { status: 500 })
  }
}
