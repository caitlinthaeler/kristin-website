const R2_BASE_URL = 'https://r2-worker.caitlin-thaeler.workers.dev'

export function r2url(key: string): string {
  if (!key) return ''
  const clean = key.startsWith('/') ? key.slice(1) : key
  return `${R2_BASE_URL}/${clean}`
}

export function isVideo(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext === 'mp4' || ext === 'webm' || ext === 'mov'
}

export function isImage(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg' || ext === 'webp'
}
