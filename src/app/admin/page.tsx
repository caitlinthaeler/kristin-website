const SECTIONS = [
  { label: 'Media', href: '/admin/media', description: 'Upload, edit, archive, or hide individual media items.' },
  { label: 'Projects', href: '/admin/projects', description: 'Create and manage film/animation projects that group media.' },
  { label: 'Collections', href: '/admin/collections', description: 'Organize media into browsable collections and subcollections.' },
  { label: 'Services', href: '/admin/services', description: 'Manage your commission and freelance offerings.' },
  { label: 'Skills & Achievements', href: '/admin/achievements', description: 'Add software skills, education, jobs, events, and collaborations.' },
  { label: 'Site Settings', href: '/admin/settings', description: 'Update your bio, email, social links, resume, and featured film.' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted mb-10">Manage your portfolio content.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="block bg-surface rounded-xl p-6 hover:bg-surface-elevated transition-colors border border-border"
          >
            <h2 className="font-semibold mb-2">{s.label}</h2>
            <p className="text-sm text-muted">{s.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
