import HeroCinema from './(home)/components/HeroCinema'
import PortfolioGrid from './(home)/components/PortfolioGrid'

const FEATURED_FILM = 'films/Thaeler_WhenTheSnowFalls_052825.mp4'
const FEATURED_TITLE = 'When The Snow Falls'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroCinema filmSrc={FEATURED_FILM} filmTitle={FEATURED_TITLE} />
      <PortfolioGrid />
    </div>
  )
}
