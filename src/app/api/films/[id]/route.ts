import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const { env } = getRequestContext()
    const film = await env.DB.prepare(
      'SELECT * FROM media WHERE id = ? AND type = ? AND archived = 0',
    )
      .bind(id, 'film')
      .first()
    if (!film) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(film)
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
