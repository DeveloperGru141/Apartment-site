import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesSearch from "@/components/properties/PropertiesSearch";

export const metadata: Metadata = {
  title: "Properties — HORIZON Lagos",
  description:
    "Browse the HORIZON portfolio: prime apartments, penthouses, maisonettes, commercial spaces, and land across Ikoyi, Victoria Island, Lekki, and Eko Atlantic.",
};

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <PropertiesSearch />
    </Suspense>
  );
}