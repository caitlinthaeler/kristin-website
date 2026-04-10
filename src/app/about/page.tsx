import AboutContent from './components/AboutContent'

export const metadata = { title: 'About — Kristin Thaeler' }

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">About</h1>
        </div>
        <AboutContent />
      </div>
    </div>
  )
}
