import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted mb-8">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  )
}
