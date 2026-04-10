// All routes under /admin are protected by Cloudflare Access at the edge.
// No custom auth checks needed — CF Access handles it before requests reach the app.

import type { Metadata } from 'next'
import AdminNav from './components/AdminNav'

export const metadata: Metadata = {
  title: 'Admin — Kristin Thaeler',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminNav />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
