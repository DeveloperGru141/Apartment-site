import Hero from "@/components/landing/hero";
import AboutStats from "@/components/landing/about-stats";
import Services from "@/components/landing/services";
import Portfolio from "@/components/landing/portfolio";
import Concierge from "@/components/landing/concierge";
import Testimonials from "@/components/landing/testimonials";
import Blog from "@/components/landing/blog";
import PhotoRibbon from "@/components/landing/photo-ribbon";
import CtaSection from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutStats />
      <Services />
      <Portfolio />
      <Concierge />
      <Testimonials />
      <Blog />
      <PhotoRibbon />
      <CtaSection />
    </>
  );
}
