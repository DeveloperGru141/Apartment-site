import { BedDouble, Bath, Ruler } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number
  bathrooms: number
  sqft: number
}

function pluralize(value: number, one: string, many: string) {
  return `${value.toLocaleString("en-NG")} ${value === 1 ? one : many}`
}

export default function PropertySpecs({ bedrooms, bathrooms, sqft }: PropertySpecsProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-fg-muted">
      {bedrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <BedDouble className="w-4 h-4 text-fg-muted" /> {pluralize(bedrooms, "bed", "beds")}
        </span>
      )}
      {bathrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-fg-muted" /> {pluralize(bathrooms, "bath", "baths")}
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Ruler className="w-4 h-4 text-fg-muted" /> {sqft.toLocaleString("en-NG")} sqft
      </span>
    </div>
  )
}
