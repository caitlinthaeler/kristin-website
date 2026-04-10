import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// Map extensions → MIME types
const MIME: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
}

/** POST /api/admin/upload
 *  Body: multipart/form-data with:
 *    file   — the file to upload
 *    folder — destination folder in R2 (e.g. "films", "animations", "thumbnails")
 *  Returns: { key: string }
 */
export async function POST(req: Request) {
  try {
    const { env } = getRequestContext()
    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = ((form.get('folder') as string) || 'uploads').replace(/[^a-zA-Z0-9_-]/g, '')

    if (!file || file.size === 0) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
    const key = `${folder}/${Date.now()}_${safeName}`
    const contentType = MIME[ext] ?? 'application/octet-stream'

    const buf = await file.arrayBuffer()
    await env.MEDIA_BUCKET.put(key, buf, {
      httpMetadata: { contentType },
    })

    return Response.json({ key }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed'
    // Graceful dev fallback — no binding in local Next.js server
    if (msg.includes('context') || msg.includes('binding') || msg.includes('MEDIA_BUCKET')) {
      return Response.json({ error: 'Upload not available in dev mode (requires Cloudflare runtime)' }, { status: 503 })
    }
    return Response.json({ error: msg }, { status: 500 })
  }
}

/** DELETE /api/admin/upload
 *  Body: { key: string }
 *  Deletes a key from R2.
 */
export async function DELETE(req: Request) {
  try {
    const { env } = getRequestContext()
    const { key } = await req.json() as { key?: string }
    if (!key) return Response.json({ error: 'key required' }, { status: 400 })

    await env.MEDIA_BUCKET.delete(key)
    return Response.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Delete failed'
    if (msg.includes('context') || msg.includes('binding') || msg.includes('MEDIA_BUCKET')) {
      return Response.json({ error: 'Delete not available in dev mode' }, { status: 503 })
    }
    return Response.json({ error: msg }, { status: 500 })
  }
}
