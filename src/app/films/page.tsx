import FilmsList from '@/components/FilmsList'

export const metadata = { title: 'Films — Kristin Thaeler' }

export default function FilmsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-12">Films</h1>
        <FilmsList />
      </div>
    </div>
  )
}
