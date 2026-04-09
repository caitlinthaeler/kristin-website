import { getRequestContext } from '@cloudflare/next-on-pages'
import { getFilms } from '@/lib/db'

export const runtime = 'edge'

export async function GET() {
  try {
    const { env } = getRequestContext()
    const films = await getFilms(env.DB)
    return Response.json(films)
  } catch {
    return Response.json({ error: 'Failed to fetch films' }, { status: 500 })
  }
}
