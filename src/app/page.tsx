import HeroCinema from './(home)/components/HeroCinema'
import PortfolioGrid from './(home)/components/PortfolioGrid'
import AboutTeaser from './(home)/components/AboutTeaser'
import CommissionCta from './(home)/components/CommissionCta'

const FEATURED_FILM = 'films/Thaeler_WhenTheSnowFalls_052825.mp4'
const FEATURED_TITLE = 'When The Snow Falls'

export default function HomePage() {
  return (
    <div>
      <HeroCinema filmSrc={FEATURED_FILM} filmTitle={FEATURED_TITLE} />
      <PortfolioGrid />
      <AboutTeaser />
      <CommissionCta />
    </div>
  )
}
