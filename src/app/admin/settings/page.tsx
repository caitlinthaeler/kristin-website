import SettingsForm from './components/SettingsForm'

export default function AdminSettings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Site Settings</h1>
      <p className="text-sm text-muted mb-8">Artist info, social links, and site-wide configuration.</p>
      <SettingsForm />
    </div>
  )
}
