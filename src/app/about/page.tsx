export const metadata = { title: 'About — Kristin Thaeler' }

const inputClass = 'bg-input text-foreground placeholder:text-muted rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-ring w-full'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">About</h1>
        </div>

        <section className="mb-16">
          <div className="w-32 h-32 rounded-full skeleton mb-8" />
          <p className="text-muted italic">Bio coming soon.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-muted mb-8">Interested in working together? Send a message below.</p>
          <form className="flex flex-col gap-4 max-w-lg">
            <input type="text" placeholder="Your name" className={inputClass} />
            <input type="email" placeholder="Your email" className={inputClass} />
            <textarea rows={5} placeholder="Your message" className={`${inputClass} resize-none`} />
            <button
              type="submit"
              className="self-start bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
