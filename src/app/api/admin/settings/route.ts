import { getRequestContext } from '@cloudflare/next-on-pages'
import { getArtistInfo } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const info = await getArtistInfo(env.DB)
    return Response.json(info)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('context') || msg.includes('binding')) return Response.json({})
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { env } = getRequestContext()
    const body = await req.json() as Record<string, string>

    const keys = ['name', 'penname', 'email', 'bio', 'resume_url', 'instagram_url', 'linkedin_url', 'featured_film', 'profile_picture', 'logo_type', 'logo_image']

    const stmt = env.DB.prepare(
      'INSERT INTO artist_info (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )

    await env.DB.batch(
      keys
        .filter((k) => body[k] !== undefined)
        .map((k) => stmt.bind(k, body[k] ?? ''))
    )

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
