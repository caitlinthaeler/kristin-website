import AnimationsGallery from './components/AnimationsGallery'

export const metadata = { title: 'Animations — Kristin Thaeler' }

export default function AnimationsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-12">Animations</h1>
        <AnimationsGallery />
      </div>
    </div>
  )
}
