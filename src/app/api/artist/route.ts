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
    if (msg.includes('context') || msg.includes('binding')) {
      return Response.json({
        name: 'Kristin Thaeler',
        penname: 'firresketches',
        email: '',
        bio: '',
        resume_url: '',
        instagram_url: '',
        linkedin_url: '',
        profile_picture: '',
      })
    }
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
