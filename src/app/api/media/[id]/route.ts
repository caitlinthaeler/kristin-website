import { getRequestContext } from '@cloudflare/next-on-pages'
import { getMediaById } from '@/lib/db'

export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { env } = getRequestContext()
    const media = await getMediaById(env.DB, Number(id))
    if (!media) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(media)
  } catch {
    return Response.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}
