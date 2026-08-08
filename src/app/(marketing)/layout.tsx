import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";
import FloatingConcierge from "@/components/shared/FloatingConcierge";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingConcierge />
    </>
  );
}
