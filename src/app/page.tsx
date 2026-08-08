import Navbar from "@/components/navigation/Navbar"
import Footer from "@/components/shared/Footer"
import HeroSearch from "@/components/home/HeroSearch"
import FeaturedPortfolio from "@/components/home/FeaturedPortfolio"
import CuratedCategories from "@/components/home/CuratedCategories"
import NeighborhoodShowcase from "@/components/home/NeighborhoodShowcase"
import ConciergeValueProp from "@/components/home/ConciergeValueProp"
import JournalInsights from "@/components/home/JournalInsights"
import { ScrollBlurSection } from "@/components/shared/ScrollBlurSection"

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSearch />
      <main className="space-y-4">
        <ScrollBlurSection variant="zoom">
          <FeaturedPortfolio />
        </ScrollBlurSection>
        <ScrollBlurSection variant="fade">
          <CuratedCategories />
        </ScrollBlurSection>
        <ScrollBlurSection variant="parallax">
          <NeighborhoodShowcase />
        </ScrollBlurSection>
        <ScrollBlurSection variant="default">
          <ConciergeValueProp />
        </ScrollBlurSection>
        <ScrollBlurSection variant="zoom">
          <JournalInsights />
        </ScrollBlurSection>
      </main>
      <Footer />
    </>
  )
}
