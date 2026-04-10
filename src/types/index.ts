export type MediaType = 'film' | 'animation' | 'animatic' | 'gif' | 'image' | 'life-drawing'
export type AchievementCategory = 'software' | 'education' | 'experience' | 'event' | 'collaboration' | 'other'
export type ServiceContentType = 'text' | 'pdf' | 'image' | 'instagram'

export interface Media {
  id: number
  filename: string
  title: string | null
  description: string | null
  type: MediaType
  thumbnail: string | null
  created_date: string | null
  archived: boolean
  hidden: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description: string | null
  thumbnail: string | null
  hidden: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Collection {
  id: number
  title: string
  description: string | null
  parent_id: number | null
  hidden: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  description: string | null
  price_info: string | null
  content_type: ServiceContentType
  content_url: string | null
  hidden: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: number
  category: AchievementCategory
  title: string
  subtitle: string | null
  date_text: string | null
  hidden: boolean
  sort_order: number
}

export interface ArtistInfo {
  name: string
  penname: string
  email: string
  bio: string
  resume_url: string
  instagram_url: string
  linkedin_url: string
  featured_film: string
  profile_picture: string
  logo_type: 'text' | 'image'
  logo_image: string
}

export type ProjectSectionType = 'text' | 'media' | 'gallery'

export interface ProjectSection {
  id: number
  project_id: number
  section_type: ProjectSectionType
  title: string | null
  content: string | null
  media_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface HomeSection {
  id: number
  section_key: string
  label: string
  title: string | null
  subtitle: string | null
  body: string | null
  cta_label: string | null
  cta_href: string | null
  media_id: number | null
  hidden: boolean
  sort_order: number
  updated_at: string
}
