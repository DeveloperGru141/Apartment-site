"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { SlidersHorizontal, X, Search } from "lucide-react"
import PropertyCard from "@/components/properties/PropertyCard"
import type { Property } from "@/lib/data/properties"
import { properties, LISTING_STATUSES, PROPERTY_TYPES } from "@/lib/data/properties"
import { agents } from "@/lib/data/agents"

const PRICE_BUCKETS = [
  { label: "Any price", value: "" },
  { label: "Under ₦50M", value: "0-50000000" },
  { label: "₦50M – ₦150M", value: "50000000-150000000" },
  { label: "₦150M – ₦500M", value: "150000000-500000000" },
  { label: "₦500M – ₦1B", value: "500000000-1000000000" },
  { label: "Above ₦1B", value: "1000000000-" },
]

const BEDROOM_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"]

const NEIGHBORHOODS = [...new Set(properties.map((p) => p.neighborhood))]

const PAGE_SIZE = 12

function applyFilters(params: URLSearchParams): typeof properties {
  let list = properties

  const q = params.get("q")?.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  const status = params.get("status")
  if (status) list = list.filter((p) => p.status === status)

  const propertyType = params.get("propertyType")
  if (propertyType) list = list.filter((p) => p.propertyType === propertyType)

  const category = params.get("category")
  if (category) {
    const filters: Record<string, (p: Property) => boolean> = {
      rental: (p) => p.status === "For Rent",
      "off-plan": (p) => p.status === "Off-Plan",
      commercial: (p) => p.propertyType === "Commercial",
      land: (p) => p.status === "Land",
      resale: (p) => p.status === "For Sale",
    }
    const match = filters[category]
    if (match) list = list.filter(match)
  }

  const neighborhood = params.get("neighborhood")
  if (neighborhood) list = list.filter((p) => p.neighborhood === neighborhood)

  const agent = params.get("agent")
  if (agent) list = list.filter((p) => p.agentId === agent)

  const price = params.get("price")
  if (price) {
    const [minRaw, maxRaw] = price.split("-")
    const min = minRaw ? Number(minRaw) : 0
    const max = maxRaw ? Number(maxRaw) : Infinity
    list = list.filter((p) => p.price >= min && p.price <= max)
  }

  const bedrooms = params.get("bedrooms")
  if (bedrooms && bedrooms !== "Any") {
    const min = Number(bedrooms.replace("+", ""))
    if (!Number.isNaN(min)) list = list.filter((p) => p.bedrooms >= min)
  }

  return list
}

function Filter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduced = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const results = useMemo(() => applyFilters(params), [params])

  const visibleResults = results.slice(0, visible)

  const updateParams = useCallback(
    (next: URLSearchParams) => {
      router.replace(`/properties?${next.toString()}`, { scroll: false })
    },
    [router]
  )

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setVisible(PAGE_SIZE)
    updateParams(next)
  }

  function clearAll() {
    setVisible(PAGE_SIZE)
    router.replace("/properties", { scroll: false })
  }

  const activeFilterCount = useMemo(
    () => ["q", "status", "propertyType", "category", "neighborhood", "agent", "price", "bedrooms"].filter((k) => params.get(k)).length,
    [params]
  )

  const label = `${results.length} ${results.length === 1 ? "Property" : "Properties"} Available`

  const filterSections = (
    <>
      <div className="mb-6">
        <label htmlFor="q" className="block text-sm font-semibold text-text-primary mb-2">
          Keyword / Property ID
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="q"
            value={params.get("q") ?? ""}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Penthouse, LK-001, Freedom Way…"
            className="w-full bg-white border border-gray-200 text-sm pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-2">Status</p>
        <div className="flex flex-col gap-2">
          {LISTING_STATUSES.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm text-text-body cursor-pointer group">
              <input
                type="radio"
                name="status"
                checked={params.get("status") === s}
                onChange={() => setParam("status", s)}
                className="accent-accent"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-2">Property Type</p>
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {PROPERTY_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-text-body cursor-pointer group">
              <input
                type="radio"
                name="propertyType"
                checked={params.get("propertyType") === t}
                onChange={() => setParam("propertyType", t)}
                className="accent-accent"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="bedrooms" className="block text-sm font-semibold text-text-primary mb-2">
          Bedrooms
        </label>
        <select
          id="bedrooms"
          value={params.get("bedrooms") ?? "Any"}
          onChange={(e) => setParam("bedrooms", e.target.value === "Any" ? "" : e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        >
          {BEDROOM_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="price" className="block text-sm font-semibold text-text-primary mb-2">
          Max Price
        </label>
        <select
          id="price"
          value={params.get("price") ?? ""}
          onChange={(e) => setParam("price", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        >
          {PRICE_BUCKETS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="neighborhood" className="block text-sm font-semibold text-text-primary mb-2">
          Neighborhood
        </label>
        <select
          id="neighborhood"
          value={params.get("neighborhood") ?? ""}
          onChange={(e) => setParam("neighborhood", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        >
          {["", ...NEIGHBORHOODS].map((n) => (
            <option key={n} value={n}>{n || "All neighborhoods"}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="agent" className="block text-sm font-semibold text-text-primary mb-2">
          Listing Agent
        </label>
        <select
          id="agent"
          value={params.get("agent") ?? ""}
          onChange={(e) => setParam("agent", e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearAll}
          className="flex-1 text-sm font-semibold text-text-muted border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center text-xs text-accent px-2">
            {activeFilterCount} active
          </span>
        )}
      </div>
    </>
  )

  return (
    <section className="py-24 bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-text-muted mb-2">The Portfolio</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Properties</h1>
          <p className="text-text-body mt-2">{label}</p>
        </div>

        <div className="lg:flex lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24 p-6 bg-bg-alt border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                <h2 className="font-heading font-bold text-text-primary">Filters</h2>
              </div>
              {filterSections}
            </div>
          </aside>

          {/* Mobile filter trigger */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center gap-2 bg-bg-dark text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleResults.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: reduced ? 0 : Math.min(i % PAGE_SIZE, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PropertyCard property={p} className="h-full" />
                  </motion.div>
                ))}
            </AnimatePresence>
            </motion.div>

            {results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-muted mb-2">No properties match those filters.</p>
                <button onClick={clearAll} className="text-accent underline underline-offset-4 hover:text-text-primary">
                  Clear all filters
                </button>
              </div>
            )}

            {visible < results.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="shine-sweep inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-text-primary">Filters</h2>
                <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
              {filterSections}
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full mt-6 bg-accent text-white text-sm font-semibold py-3 rounded-lg"
              >
                Show {results.length} Results
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function PropertiesPage() {
  return <Filter />
}