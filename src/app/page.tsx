import { Suspense } from "react"
import Navbar from "@/components/navigation/Navbar"
import Footer from "@/components/shared/Footer"
import HeroSearch from "@/components/home/HeroSearch"
import LocationMarquee from "@/components/home/LocationMarquee"
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
      <LocationMarquee />
      <ScrollBlurSection>
        <Testimonials />
      </ScrollBlurSection>
      <main className="space-y-4">
        <ScrollBlurSection>
          <FeaturedPortfolio />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <CuratedCategories />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <NeighborhoodShowcase />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <ConciergeValueProp />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <TeamSpotlight />
        </ScrollBlurSection>
        <ScrollBlurSection>
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
