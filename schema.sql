-- Kristin Portfolio - D1 Schema
-- Run: wrangler d1 execute kristin-portfolio --file=schema.sql

-- Artist profile / site-wide settings
CREATE TABLE IF NOT EXISTS artist_info (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed artist info defaults
INSERT OR IGNORE INTO artist_info (key, value) VALUES
  ('name', 'Kristin Thaeler'),
  ('penname', 'firresketches'),
  ('email', ''),
  ('bio', ''),
  ('resume_url', ''),
  ('instagram_url', ''),
  ('linkedin_url', ''),
  ('featured_film', 'films/Thaeler_WhenTheSnowFalls_052825.mp4');

-- Media items (animations, films, images, gifs, animatics)
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,         -- R2 object key, e.g. "films/myvideo.mp4"
  title TEXT,
  description TEXT,
  type TEXT NOT NULL CHECK(type IN ('film', 'animation', 'animatic', 'gif', 'image', 'life-drawing')),
  thumbnail TEXT,                 -- R2 key for thumbnail image (optional)
  created_date TEXT,              -- artist-specified creation date (free text)
  archived INTEGER NOT NULL DEFAULT 0,
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed existing media
INSERT OR IGNORE INTO media (filename, title, description, type) VALUES
  ('films/Thaeler_WhenTheSnowFalls_052825.mp4', 'When The Snow Falls', 'description of the film', 'film'),
  ('films/Render_v16.mp4', 'Plane Pals', 'Plane Pals, a short film about a shy girl who musters up the courage to make a new friend', 'film'),
  ('animations/shot36_color_KT_v01.gif', NULL, NULL, 'animation'),
  ('animations/shot32_color_KT_v04.gif', NULL, NULL, 'animation');

-- Projects (a film or animation project that groups media)
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,                 -- R2 key for cover image
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link media to projects (many-to-many)
CREATE TABLE IF NOT EXISTS project_media (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, media_id)
);

-- Collections (browsable groupings like "Character Studies", "2024 Reel", etc.)
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link media to collections (many-to-many)
CREATE TABLE IF NOT EXISTS collection_media (
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, media_id)
);

-- Services / commission offerings
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price_info TEXT,               -- free text (e.g. "starting at $X", "enquire for pricing")
  content_type TEXT NOT NULL DEFAULT 'text' CHECK(content_type IN ('text', 'pdf', 'image', 'instagram')),
  content_url TEXT,              -- R2 key or external URL for PDF/image/instagram embed
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Skills / achievements
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK(category IN ('software', 'education', 'experience', 'event', 'collaboration', 'other')),
  title TEXT NOT NULL,
  subtitle TEXT,
  date_text TEXT,
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Instagram post visibility control
CREATE TABLE IF NOT EXISTS instagram_posts (
  post_id TEXT PRIMARY KEY,      -- behold.so post ID
  hidden INTEGER NOT NULL DEFAULT 0
);

-- ─── Additional artist_info keys ──────────────────────────────────────────────
INSERT OR IGNORE INTO artist_info (key, value) VALUES
  ('profile_picture', ''),           -- R2 key for artist profile photo
  ('logo_type', 'text'),             -- 'text' | 'image'
  ('logo_image', '');                -- R2 key for logo image (only used when logo_type = 'image')

-- ─── Project sections (rich content blocks per project) ───────────────────────
CREATE TABLE IF NOT EXISTS project_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL DEFAULT 'text'
    CHECK(section_type IN ('text', 'media', 'gallery')),
  title TEXT,
  content TEXT,                  -- markdown / plain text for 'text' sections
  media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Home page sections (admin-editable content blocks) ───────────────────────
CREATE TABLE IF NOT EXISTS home_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT NOT NULL UNIQUE, -- e.g. 'hero', 'portfolio_grid', 'about_teaser', 'commission_cta'
  label TEXT NOT NULL,              -- display name in admin
  title TEXT,
  subtitle TEXT,
  body TEXT,                        -- markdown / plain text
  cta_label TEXT,
  cta_href TEXT,
  media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed home sections
INSERT OR IGNORE INTO home_sections (section_key, label, title, subtitle, sort_order) VALUES
  ('hero',           'Hero / Featured Film',    'Kristin Thaeler',   'Animator · Storyteller · @firresketches', 0),
  ('portfolio_grid', 'Portfolio Grid',          NULL,                NULL,                                      1),
  ('about_teaser',   'About Teaser',            NULL,                NULL,                                      2),
  ('commission_cta', 'Commission / Hire Me CTA', NULL,               NULL,                                      3);
