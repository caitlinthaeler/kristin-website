import GalleryBrowser from './components/GalleryBrowser'

export const metadata = { title: 'Gallery — Kristin Thaeler' }

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-22 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Gallery</h1>
          <p className="text-muted mt-2 text-sm">Browse collections and all works.</p>
        </div>
        <GalleryBrowser />
      </div>
    </div>
  )
}

