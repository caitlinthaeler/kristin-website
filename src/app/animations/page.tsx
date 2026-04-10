import AnimationsGallery from './components/AnimationsGallery'

export const metadata = { title: 'Animations — Kristin Thaeler' }

export default function AnimationsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Animations</h1>
        </div>
        <AnimationsGallery />
      </div>
    </div>
  )
}
