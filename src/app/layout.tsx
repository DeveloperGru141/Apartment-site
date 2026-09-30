import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import ViewTransition from "@/components/view-transition";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "HORIZON — Luxury Rentals",
  description: "Where dreams meet reality. Premium apartment rentals curated for discerning residents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className={`${jakarta.variable} ${display.variable}`}>
      <body>
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
