import type { Media, Project, Collection, Service, Achievement, ArtistInfo } from '@/types'

// ── Media ──────────────────────────────────────────────────────────────────

export async function getMedia(db: D1Database, type?: string): Promise<Media[]> {
  const query = type
    ? 'SELECT * FROM media WHERE hidden = 0 AND archived = 0 AND type = ? ORDER BY sort_order ASC, id DESC'
    : 'SELECT * FROM media WHERE hidden = 0 AND archived = 0 ORDER BY sort_order ASC, id DESC'
  const result = type
    ? await db.prepare(query).bind(type).all<Media>()
    : await db.prepare(query).all<Media>()
  return result.results
}

export async function getMediaById(db: D1Database, id: number): Promise<Media | null> {
  return db.prepare('SELECT * FROM media WHERE id = ?').bind(id).first<Media>()
}

export async function getAllMediaAdmin(db: D1Database): Promise<Media[]> {
  const result = await db
    .prepare('SELECT * FROM media ORDER BY sort_order ASC, id DESC')
    .all<Media>()
  return result.results
}

// ── Films ──────────────────────────────────────────────────────────────────

export async function getFilms(db: D1Database): Promise<Media[]> {
  return getMedia(db, 'film')
}

// ── Animations ─────────────────────────────────────────────────────────────

export async function getAnimations(db: D1Database): Promise<Media[]> {
  const result = await db
    .prepare(
      "SELECT * FROM media WHERE hidden = 0 AND archived = 0 AND type IN ('animation', 'animatic', 'gif') ORDER BY sort_order ASC, id DESC"
    )
    .all<Media>()
  return result.results
}

// ── Projects ───────────────────────────────────────────────────────────────

export async function getProjects(db: D1Database): Promise<Project[]> {
  const result = await db
    .prepare('SELECT * FROM projects WHERE hidden = 0 ORDER BY sort_order ASC, id DESC')
    .all<Project>()
  return result.results
}

export async function getProjectById(db: D1Database, id: number): Promise<Project | null> {
  return db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Project>()
}

export async function getProjectMedia(db: D1Database, projectId: number): Promise<Media[]> {
  const result = await db
    .prepare(
      `SELECT m.* FROM media m
       JOIN project_media pm ON pm.media_id = m.id
       WHERE pm.project_id = ? AND m.hidden = 0 AND m.archived = 0
       ORDER BY m.sort_order ASC`
    )
    .bind(projectId)
    .all<Media>()
  return result.results
}

// ── Collections ────────────────────────────────────────────────────────────

export async function getCollections(db: D1Database, parentId?: number | null): Promise<Collection[]> {
  const query =
    parentId === undefined
      ? 'SELECT * FROM collections WHERE hidden = 0 ORDER BY sort_order ASC, id ASC'
      : parentId === null
      ? 'SELECT * FROM collections WHERE hidden = 0 AND parent_id IS NULL ORDER BY sort_order ASC, id ASC'
      : 'SELECT * FROM collections WHERE hidden = 0 AND parent_id = ? ORDER BY sort_order ASC, id ASC'
  const result =
    parentId === undefined || parentId === null
      ? await db.prepare(query).all<Collection>()
      : await db.prepare(query).bind(parentId).all<Collection>()
  return result.results
}

// ── Services ───────────────────────────────────────────────────────────────

export async function getServices(db: D1Database): Promise<Service[]> {
  const result = await db
    .prepare('SELECT * FROM services WHERE hidden = 0 ORDER BY sort_order ASC, id ASC')
    .all<Service>()
  return result.results
}

// ── Achievements ───────────────────────────────────────────────────────────

export async function getAchievements(db: D1Database): Promise<Achievement[]> {
  const result = await db
    .prepare('SELECT * FROM achievements WHERE hidden = 0 ORDER BY sort_order ASC, id ASC')
    .all<Achievement>()
  return result.results
}

// ── Artist Info ────────────────────────────────────────────────────────────

export async function getArtistInfo(db: D1Database): Promise<ArtistInfo> {
  const result = await db
    .prepare('SELECT key, value FROM artist_info')
    .all<{ key: string; value: string }>()

  const map = Object.fromEntries(result.results.map((r) => [r.key, r.value]))

  return {
    name: map.name ?? 'Kristin Thaeler',
    penname: map.penname ?? 'firresketches',
    email: map.email ?? '',
    bio: map.bio ?? '',
    resume_url: map.resume_url ?? '',
    instagram_url: map.instagram_url ?? '',
    linkedin_url: map.linkedin_url ?? '',
    featured_film: map.featured_film ?? '',
  }
}
