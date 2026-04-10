import Link from 'next/link'

const SECTIONS = [
  {
    label: 'Media',
    href: '/admin/media',
    description: 'Upload, edit, archive, or hide individual media files.',
    icon: '🎬',
    color: 'bg-primary/8 hover:bg-primary/12 border-primary/20',
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    description: 'Create film & animation projects that group media pieces.',
    icon: '📁',
    color: 'bg-secondary/8 hover:bg-secondary/12 border-secondary/20',
  },
  {
    label: 'Collections',
    href: '/admin/collections',
    description: 'Organize media into browsable collections e.g. Life Drawings.',
    icon: '🗂️',
    color: 'bg-accent/10 hover:bg-accent/15 border-accent/20',
  },
  {
    label: 'Services',
    href: '/admin/services',
    description: 'Manage commission & freelance offerings shown to visitors.',
    icon: '✏️',
    color: 'bg-primary/6 hover:bg-primary/10 border-primary/15',
  },
  {
    label: 'Skills & Achievements',
    href: '/admin/achievements',
    description: 'Software skills, education, jobs, events & collaborations.',
    icon: '⭐',
    color: 'bg-secondary/6 hover:bg-secondary/10 border-secondary/15',
  },
  {
    label: 'Site Settings',
    href: '/admin/settings',
    description: 'Bio, email, social links, resume, and featured film.',
    icon: '⚙️',
    color: 'bg-surface hover:bg-surface border-border',
  },
]

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-1">Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted mt-1 text-sm">Manage all aspects of your portfolio.</p>
      </div>

      {/* Quick actions highlight */}
      <div className="mb-8 p-4 rounded-xl bg-primary/8 border border-primary/20 flex flex-wrap items-center gap-4">
        <div>
          <p className="font-semibold text-sm text-foreground">Upload new media</p>
          <p className="text-xs text-muted">Add films, animations, drawings, or images to your portfolio.</p>
        </div>
        <Link
          href="/admin/media"
          className="shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
        >
          + Add Media
        </Link>
      </div>

      {/* Section grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`group block rounded-xl p-5 border transition-all duration-200 ${s.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">{s.icon}</span>
              <div>
                <h2 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {s.label}
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">{s.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer tip */}
      <p className="mt-10 text-xs text-muted/60">
        This admin area is protected by Cloudflare Access. Log out via the sidebar link.
      </p>
    </div>
  )
}
