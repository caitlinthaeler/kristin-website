export const metadata = { title: 'Services — Kristin Thaeler' }

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-4">Services</h1>
        <p className="text-muted mb-12">Commission offerings and freelance work — coming soon.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-xl p-6">
              <div className="h-5 w-32 skeleton mb-3" />
              <div className="h-3 w-full skeleton mb-2" />
              <div className="h-3 w-3/4 skeleton mb-6" />
              <a
                href="/about#contact"
                className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Enquire
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
