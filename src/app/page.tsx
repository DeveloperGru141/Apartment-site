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
import { fetchLiveProperties } from "@/lib/property-live"
import { getNavbarUser } from "@/lib/navbar-user"

export const dynamic = "force-dynamic";

export default async function Home() {
  const [properties, user] = await Promise.all([fetchLiveProperties(), getNavbarUser()]);

  return (
    <>
      <Suspense>
        <Navbar user={user} />
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
          <FeaturedPortfolio properties={properties} />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <CuratedCategories properties={properties} />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <NeighborhoodShowcase properties={properties} />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <ConciergeValueProp />
        </ScrollBlurSection>
        <ScrollBlurSection>
          <TeamSpotlight properties={properties} />
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
