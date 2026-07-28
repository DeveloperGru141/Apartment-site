import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import ViewTransition from "@/components/view-transition";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "HORIZON — Luxury Rentals",
  description: "Where dreams meet reality. Premium apartment rentals curated for discerning residents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <ViewTransition>{children}</ViewTransition>
        </AuthProvider>
      </body>
    </html>
  );
}
