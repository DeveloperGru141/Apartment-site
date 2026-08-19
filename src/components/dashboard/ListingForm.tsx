"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ChevronUp, ChevronDown, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { agents } from "@/lib/data/agents"
import { NEIGHBORHOODS } from "@/lib/images"
import { formatPrice } from "@/lib/format"
import { saveListing } from "@/app/dashboard/actions"
import type { Database } from "@/types/database.types"

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]

const STATUSES: Database["public"]["Enums"]["property_status"][] = ["For Rent", "For Sale"]

const PROPERTY_TYPES: Database["public"]["Enums"]["property_type"][] = [
  "Apartment",
  "Maisonette",
  "Penthouse",
  "Townhouse",
  "Terrace",
  "Detached Duplex",
  "Semi-Detached",
  "Detached Bungalow",
  "Commercial",
]

interface UploadItem {
  url: string
  path: string
  uploading: boolean
  progress: number
}

interface ListingFormProps {
  mode: "create" | "edit"
  listing?: PropertyRow
}

const inputClass =
  "w-full bg-slate-950/70 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-500"

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong. Please try again."
}

export default function ListingForm({ mode, listing }: ListingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(listing?.title ?? "")
  const [description, setDescription] = useState(listing?.description ?? "")
  const [neighborhood, setNeighborhood] = useState(listing?.neighborhood ?? "")
  const [location, setLocation] = useState(listing?.location ?? "")
  const [status, setStatus] = useState<Database["public"]["Enums"]["property_status"]>(listing?.status ?? "For Rent")
  const [propertyType, setPropertyType] = useState<Database["public"]["Enums"]["property_type"]>(listing?.property_type ?? "Apartment")
  const [bedrooms, setBedrooms] = useState(listing?.bedrooms?.toString() ?? "0")
  const [bathrooms, setBathrooms] = useState(listing ? listing.bathrooms.toString() : "0")
  const [sqft, setSqft] = useState(listing?.sqft?.toString() ?? "")
  const [price, setPrice] = useState(listing ? Number(listing.price).toString() : "")
  const [agentId, setAgentId] = useState(listing?.agent_id ?? "")
  const [images, setImages] = useState<UploadItem[]>(
    listing?.images.map((url) => {
      const match = url.match(/\/object\/public\/property-images\/(.+)$/)
      return { url, path: match ? decodeURIComponent(match[1]) : "", uploading: false, progress: 100 }
    }) ?? []
  )
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const folderUuid = useMemo(() => {
    if (listing && listing.images.length > 0) {
      const match = listing.images[0].match(/property-images\/[^/]+\/([^/]+)\//)
      if (match) return match[1]
    }
    return crypto.randomUUID()
  }, [listing])

  const priceLabel = useMemo(() => (Number(price) > 0 ? formatPrice(Number(price), status) : ""), [price, status])

  function validateClient(): boolean {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = "Title is required"
    if (!description.trim()) errors.description = "Description is required"
    if (!neighborhood) errors.neighborhood = "Pick a neighborhood"
    if (!location.trim()) errors.location = "Location is required"
    if (!agentId) errors.agentId = "Pick an agent to handle inquiries"
    if (images.length === 0) errors.images = "Upload at least one photo"
    if (Number(price) <= 0) errors.price = "Price must be greater than 0"
    if (Number(bedrooms) < 0 || Number(bathrooms) < 0 || (sqft !== "" && Number(sqft) < 0)) {
      errors.numbers = "Bedrooms, bathrooms, and sqft cannot be negative"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const newItems: UploadItem[] = [...images]

    for (const file of Array.from(files)) {
      const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      const path = `${user.id}/${folderUuid}/${crypto.randomUUID()}-${filename}`
      const item: UploadItem = { url: "", path, uploading: true, progress: 0 }
      newItems.push(item)
      setImages([...newItems])

      const { data, error } = await supabase.storage.from("property-images").upload(path, file)

      if (error) {
        newItems.splice(newItems.indexOf(item), 1)
        setImages([...newItems])
        setError(`Failed to upload ${file.name}: ${error.message}`)
        continue
      }

      const { data: publicData } = supabase.storage.from("property-images").getPublicUrl(data.path)
      item.url = publicData.publicUrl
      item.uploading = false
      item.progress = 100
      setImages([...newItems])
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function removeImage(item: UploadItem) {
    setImages((prev) => prev.filter((i) => i !== item))
    if (item.path && !item.uploading) {
      const supabase = createClient()
      await supabase.storage.from("property-images").remove([item.path])
    }
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!validateClient()) return

    const pending = images.some((i) => i.uploading)
    if (pending) {
      setError("Wait for all uploads to finish before saving.")
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    if (listing) formData.set("id", listing.id)
    formData.set("title", title)
    formData.set("description", description)
    formData.set("neighborhood", neighborhood)
    formData.set("location", location)
    formData.set("status", status)
    formData.set("propertyType", propertyType)
    formData.set("bedrooms", bedrooms)
    formData.set("bathrooms", bathrooms)
    if (sqft !== "") formData.set("sqft", sqft)
    formData.set("price", price)
    formData.set("agentId", agentId)
    formData.set("images", JSON.stringify(images.filter((i) => !i.uploading).map((i) => i.url)))

    try {
      await saveListing(formData)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(errorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Listings
      </Link>

      <h1 className="font-heading text-3xl font-bold text-white mb-2">
        {mode === "create" ? "List a New Property" : "Edit Listing"}
      </h1>
      <p className="text-slate-400 text-sm mb-10">
        Your agent gets attached automatically — buyer WhatsApp inquiries route straight to them.
      </p>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <div className="space-y-8">
        <section className="space-y-5">
          <h2 className="font-heading text-lg font-bold text-amber-400 uppercase tracking-wider text-sm">
            Basics
          </h2>

          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="3-Bedroom Duplex in Bourdillon, Ikoyi"
              className={inputClass}
            />
            {fieldErrors.title && <p className="text-xs text-red-400 mt-1">{fieldErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell buyers what makes this property special…"
              className={`${inputClass} resize-none`}
            />
            {fieldErrors.description && <p className="text-xs text-red-400 mt-1">{fieldErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="neighborhood" className={labelClass}>Neighborhood</label>
              <select
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>Select neighborhood</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {fieldErrors.neighborhood && <p className="text-xs text-red-400 mt-1">{fieldErrors.neighborhood}</p>}
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>Location (street level)</label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="14 Bourdillon Road, Ikoyi, Lagos"
                className={inputClass}
              />
              {fieldErrors.location && <p className="text-xs text-red-400 mt-1">{fieldErrors.location}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-heading text-lg font-bold text-amber-400 uppercase tracking-wider text-sm">
            Property Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="propertyType" className={labelClass}>Property Type</label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
                className={inputClass}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
              <input
                id="bedrooms"
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
              <input
                id="bathrooms"
                type="number"
                min={0}
                step="0.5"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="sqft" className={labelClass}>Sqft</label>
              <input
                id="sqft"
                type="number"
                min={0}
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </div>
          </div>
          {fieldErrors.numbers && <p className="text-xs text-red-400 mt-1">{fieldErrors.numbers}</p>}

          <div>
            <label htmlFor="price" className={labelClass}>Price (NGN)</label>
            <input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="250000000"
              className={inputClass}
            />
            {priceLabel && (
              <p className="text-xs text-amber-400 mt-1.5">Displayed as: {priceLabel}</p>
            )}
            {fieldErrors.price && <p className="text-xs text-red-400 mt-1">{fieldErrors.price}</p>}
          </div>

          <div>
            <label htmlFor="agentId" className={labelClass}>Assigned Agent</label>
            <select
              id="agentId"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.role}
                </option>
              ))}
            </select>
            {fieldErrors.agentId && <p className="text-xs text-red-400 mt-1">{fieldErrors.agentId}</p>}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-amber-400 uppercase tracking-wider text-sm mb-4">
            Photos
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((item, i) => (
              <div key={item.path || item.url} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                {item.uploading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/80">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    <div className="w-3/4 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                )}

                <div className="absolute top-2 right-2 flex gap-1">
                  {!item.uploading && (
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => removeImage(item)}
                      className="bg-slate-950/70 hover:bg-red-500/80 text-white p-1.5 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {!item.uploading && (
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button
                      type="button"
                      aria-label="Move earlier"
                      disabled={i === 0}
                      onClick={() => moveImage(i, -1)}
                      className="bg-slate-950/70 hover:bg-white/20 text-white p-1.5 rounded-md transition-colors disabled:opacity-30"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move later"
                      disabled={i === images.length - 1}
                      onClick={() => moveImage(i, 1)}
                      className="bg-slate-950/70 hover:bg-white/20 text-white p-1.5 rounded-md transition-colors disabled:opacity-30"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {i === 0 && !item.uploading && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/3] rounded-lg border-2 border-dashed border-white/15 hover:border-amber-400/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-semibold uppercase tracking-wider">Add Photos</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {fieldErrors.images && <p className="text-xs text-red-400 mt-2">{fieldErrors.images}</p>}
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="shine-sweep w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-lg py-4 transition-colors disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {submitting ? "Saving…" : mode === "create" ? "Publish Listing" : "Save Changes"}
        </button>
      </div>
    </form>
  )
}