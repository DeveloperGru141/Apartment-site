import { Suspense } from "react"
import Navbar from "@/components/navigation/Navbar"
import Footer from "@/components/shared/Footer"
import HeroSearch from "@/components/home/HeroSearch"
import Testimonials from "@/components/home/Testimonials"
import FeaturedPortfolio from "@/components/home/FeaturedPortfolio"
import CuratedCategories from "@/components/home/CuratedCategories"
import NeighborhoodShowcase from "@/components/home/NeighborhoodShowcase"
import ConciergeValueProp from "@/components/home/ConciergeValueProp"
import TeamSpotlight from "@/components/home/TeamSpotlight"
import JournalInsights from "@/components/home/JournalInsights"
import FloatingConcierge from "@/components/shared/FloatingConcierge"
import { ScrollBlurSection } from "@/components/shared/ScrollBlurSection"

export default function Home() {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <ScrollBlurSection>
        <HeroSearch />
      </ScrollBlurSection>
      <ScrollBlurSection variant="fade">
        <Testimonials />
      </ScrollBlurSection>
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
          <TeamSpotlight />
        </ScrollBlurSection>
        <ScrollBlurSection variant="zoom">
          <JournalInsights />
        </ScrollBlurSection>
      </main>
      <ScrollBlurSection>
        <Footer />
      </ScrollBlurSection>
      <FloatingConcierge />
    </>
  )
}
