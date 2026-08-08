"use client"

import { useState } from "react"

const propertyTypes = ["Apartment", "Duplex", "Penthouse", "Townhouse", "Villa"]
const locations = ["Ikoyi", "Victoria Island", "Lekki", "Banana Island", "Oniru", "Parkview"]
const bedroomOptions = ["Any", "1", "2", "3", "4", "5+"]

const sections = ["type", "price", "bedrooms", "location"] as const
type Section = (typeof sections)[number]

export default function PropertyFilterSidebar() {
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(sections))
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [selectedBedrooms, setSelectedBedrooms] = useState("Any")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  function toggleSection(section: Section) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  function toggleCheckbox(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  function handleClear() {
    setSelectedTypes([])
    setPriceMin("")
    setPriceMax("")
    setSelectedBedrooms("Any")
    setSelectedLocations([])
  }

  const checkboxClass =
    "h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"

  return (
    <aside className="w-full max-w-xs bg-white border-r border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-6">Filters</h2>

      {/* Property Type */}
      <FilterSection
        title="Property Type"
        isOpen={openSections.has("type")}
        onToggle={() => toggleSection("type")}
      >
        <div className="space-y-3">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleCheckbox(selectedTypes, type, setSelectedTypes)}
                className={checkboxClass}
              />
              {type}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.has("price")}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection
        title="Bedrooms"
        isOpen={openSections.has("bedrooms")}
        onToggle={() => toggleSection("bedrooms")}
      >
        <div className="flex flex-wrap gap-2">
          {bedroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedBedrooms(option)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                selectedBedrooms === option
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection
        title="Location"
        isOpen={openSections.has("location")}
        onToggle={() => toggleSection("location")}
      >
        <div className="space-y-3">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => toggleCheckbox(selectedLocations, location, setSelectedLocations)}
                className={checkboxClass}
              />
              {location}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <button className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer">
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </aside>
  )
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-gray-50 pb-6 mb-6">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-semibold mb-3 cursor-pointer"
      >
        {title}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div>{children}</div>}
    </section>
  )
}
