import FilmsList from './components/FilmsList'

export const metadata = { title: 'Films — Kristin Thaeler' }

export default function FilmsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Films</h1>
        </div>
        <FilmsList />
      </div>
    </div>
  )
}
