// All routes under /admin are protected by Cloudflare Access at the edge.
// Do not add any custom auth checks here — CF Access handles it before
// requests reach the app.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Kristin Thaeler',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sidebar">
      <header className="border-b border-sidebar-border px-6 h-14 flex items-center gap-6">
        <span className="text-sm font-semibold text-sidebar-primary">Admin</span>
        <nav className="flex items-center gap-5 text-sm text-muted">
          {[
            ['Dashboard', '/admin'],
            ['Media', '/admin/media'],
            ['Projects', '/admin/projects'],
            ['Collections', '/admin/collections'],
            ['Services', '/admin/services'],
            ['Achievements', '/admin/achievements'],
            ['Settings', '/admin/settings'],
          ].map(([label, href]) => (
            <a key={href} href={href} className="hover:text-foreground transition-colors">{label}</a>
          ))}
        </nav>
        <a href="/" className="ml-auto text-sm text-muted hover:text-foreground transition-colors">
          ← View Site
        </a>
      </header>
      <main className="px-6 py-10 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
