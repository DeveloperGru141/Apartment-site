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
import { properties } from "@/lib/data/properties"
import { LAGOS_IMAGES } from "@/lib/images"

export default function Home() {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <main>
        <HeroSearch
          listingCount={properties.length}
          neighborhoodCount={Object.keys(LAGOS_IMAGES.neighborhoods).length}
        />
        <LocationMarquee />
        <Testimonials />
        <FeaturedPortfolio properties={properties} />
        <CuratedCategories properties={properties} />
        <NeighborhoodShowcase properties={properties} />
        <ConciergeValueProp />
        <TeamSpotlight properties={properties} />
        <JournalInsights />
      </main>
      <Footer />
      <FloatingConcierge />
    </>
  )
}
