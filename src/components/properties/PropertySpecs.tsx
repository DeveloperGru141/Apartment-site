import { BedDouble, Bath, Ruler } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number
  bathrooms: number
  sqft: number
}

export default function PropertySpecs({ bedrooms, bathrooms, sqft }: PropertySpecsProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
      {bedrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <BedDouble className="w-4 h-4 text-amber-500" /> {bedrooms} Beds
        </span>
      )}
      {bathrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-amber-500" /> {bathrooms} Baths
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Ruler className="w-4 h-4 text-amber-500" /> {sqft.toLocaleString()} sqft
      </span>
    </div>
  )
}