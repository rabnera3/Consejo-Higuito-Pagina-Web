import { Hero } from '../components/Hero'
import { WelcomeSection } from '../components/WelcomeSection'
import { NewsSection } from '../components/NewsSection'
import { PhilosophySection } from '../components/PhilosophySection'
import { BannerSection } from '../components/BannerSection'
import { PartnersSection } from '../components/PartnersSection'
import { CommunityBanner } from '../components/CommunityBanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WelcomeSection />
      <NewsSection />
      <PhilosophySection />
      <BannerSection />
      <PartnersSection />
      <CommunityBanner />
    </>
  )
}
