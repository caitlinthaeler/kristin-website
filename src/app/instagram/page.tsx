export const metadata = { title: 'Instagram — Kristin Thaeler' }

// Replace BEHOLD_FEED_ID with your behold.so feed ID
const BEHOLD_FEED_ID = 'YOUR_BEHOLD_FEED_ID'

export default function InstagramPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Instagram</h1>
        <p className="text-[var(--text-muted)] mb-12">@firresketches</p>

        {/* behold.so embed */}
        <div
          id={`behold-widget-${BEHOLD_FEED_ID}`}
          className="w-full"
        />
        {/* behold.so script must be added once you have your feed ID */}
        {/* <script src={`https://w.behold.so/widget.js`} async /> */}
      </div>
    </div>
  )
}
