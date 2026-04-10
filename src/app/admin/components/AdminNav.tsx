'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm6-1a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5H4v2h1V5zM4 9H3v2h1V9zm0 4H3v2h1v-2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
  {
    label: 'Collections',
    href: '/admin/collections',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.95 22.95 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    ),
  },
  {
    label: 'Achievements',
    href: '/admin/achievements',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function AdminNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 min-h-screen border-r border-border bg-background">
        {/* Brand */}
        <div className="px-5 h-14 flex items-center border-b border-border">
          <Link href="/admin" className="font-black text-sm tracking-tight text-foreground hover:text-primary transition-colors">
            Admin Panel
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              <span className={isActive(item.href) ? 'text-primary' : 'text-muted/60'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 pb-6 space-y-1 border-t border-border pt-4 mt-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-all duration-150"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted/60">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            View Site
          </Link>
          <a
            href="/cdn-cgi/access/logout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-destructive hover:bg-destructive/8 transition-all duration-150"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted/60">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Log out
          </a>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header className="md:hidden flex items-center gap-3 px-4 h-12 border-b border-border bg-background overflow-x-auto">
        <span className="text-xs font-bold text-foreground shrink-0">Admin</span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
              isActive(item.href) ? 'text-primary bg-primary/10' : 'text-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <a
          href="/cdn-cgi/access/logout"
          className="ml-auto shrink-0 text-xs text-muted hover:text-destructive transition-colors"
        >
          Logout
        </a>
      </header>
    </>
  )
}
