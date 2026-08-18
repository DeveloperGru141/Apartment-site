import { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";
import FloatingConcierge from "@/components/shared/FloatingConcierge";
import { getNavbarUser } from "@/lib/navbar-user";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getNavbarUser();

  return (
    <>
      <Suspense>
        <Navbar user={user} />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <FloatingConcierge />
    </>
  );
}
