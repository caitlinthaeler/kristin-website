import FilmDetail from './components/FilmDetail'

export const runtime = 'edge'
export const metadata = { title: 'Film — Kristin Thaeler' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function FilmPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="min-h-screen pt-22 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <FilmDetail id={id} />
      </div>
    </div>
  )
}
