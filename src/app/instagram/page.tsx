import InstagramFeed from './components/InstagramFeed'

export const metadata = { title: 'Instagram — Kristin Thaeler' }

export default function InstagramPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-4">Instagram</h1>
        <p className="text-muted mb-8">
          <a
            href="https://www.instagram.com/firresketches/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            @firresketches
          </a>
        </p>

        <InstagramFeed />
      </div>
    </div>
  )
}
