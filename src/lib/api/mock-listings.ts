interface MockListing {
  unit_id: string
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  rent_price: number
  deposit_amount: number
  available_from: string
  images: string[]
  amenities: string[]
  property_id: string
  property_title: string
  property_type: string
  address_line1: string
  city: string
  state: string
  zip_code: string
  neighborhood: string | null
  walk_score: number | null
  latitude: number | null
  longitude: number | null
  landlord_name: string
  landlord_avatar: string | null
}

interface MockReview {
  id: string
  unit_id: string
  reviewer_id: string
  overall_rating: number
  title: string | null
  comment: string | null
  reviewer_name: string
  reviewer_avatar: string | null
  created_at: string
}

const landlords = [
  {
    name: "Sarah Mitchell",
    avatar: "https://i.pravatar.cc/128?u=sarah",
  },
  {
    name: "James Walker",
    avatar: "https://i.pravatar.cc/128?u=james",
  },
  {
    name: "Emily Chen",
    avatar: "https://i.pravatar.cc/128?u=emily",
  },
  {
    name: "Marcus Rivera",
    avatar: "https://i.pravatar.cc/128?u=marcus",
  },
]

const imageSets: Record<string, string[]> = {
  austin: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  ],
  denver: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18f4f7c1a?w=800&q=80",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  ],
  portland: [
    "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
  ],
  nashville: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
  ],
  brooklyn: [
    "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&q=80",
  ],
}

const mockListings: MockListing[] = [
  {
    unit_id: "mock-001",
    unit_number: "1204",
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 685,
    rent_price: 1750,
    deposit_amount: 1750,
    available_from: new Date(Date.now() + 14 * 86400000).toISOString(),
    images: imageSets.austin,
    amenities: ["In-unit Laundry", "Gym", "Pool", "Rooftop Lounge", "Parking", "Pet Friendly"],
    property_id: "prop-001",
    property_title: "The Austonian",
    property_type: "apartment",
    address_line1: "200 Congress Ave",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    neighborhood: "Downtown",
    walk_score: 95,
    latitude: 30.2672,
    longitude: -97.7431,
    landlord_name: landlords[0].name,
    landlord_avatar: landlords[0].avatar,
  },
  {
    unit_id: "mock-002",
    unit_number: "3B",
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1050,
    rent_price: 2400,
    deposit_amount: 2400,
    available_from: new Date(Date.now() + 21 * 86400000).toISOString(),
    images: imageSets.austin,
    amenities: ["In-unit Laundry", "Gym", "Pool", "Concierge", "Valet Parking", "Smart Home"],
    property_id: "prop-001",
    property_title: "The Austonian",
    property_type: "apartment",
    address_line1: "200 Congress Ave",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    neighborhood: "Downtown",
    walk_score: 95,
    latitude: 30.2672,
    longitude: -97.7431,
    landlord_name: landlords[0].name,
    landlord_avatar: landlords[0].avatar,
  },
  {
    unit_id: "mock-003",
    unit_number: "7A",
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1420,
    rent_price: 3450,
    deposit_amount: 3450,
    available_from: new Date(Date.now() + 7 * 86400000).toISOString(),
    images: imageSets.denver,
    amenities: ["In-unit Laundry", "Gym", "Hot Tub", "Ski Storage", "Underground Parking", "Balcony"],
    property_id: "prop-002",
    property_title: "LoDo Heights",
    property_type: "condo",
    address_line1: "1501 Wynkoop St",
    city: "Denver",
    state: "CO",
    zip_code: "80202",
    neighborhood: "LoDo",
    walk_score: 92,
    latitude: 39.7525,
    longitude: -104.9997,
    landlord_name: landlords[1].name,
    landlord_avatar: landlords[1].avatar,
  },
  {
    unit_id: "mock-004",
    unit_number: "210",
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 920,
    rent_price: 2100,
    deposit_amount: 2100,
    available_from: new Date(Date.now() + 30 * 86400000).toISOString(),
    images: imageSets.denver,
    amenities: ["In-unit Laundry", "Bike Storage", "Rooftop Deck", "Parking"],
    property_id: "prop-002",
    property_title: "LoDo Heights",
    property_type: "condo",
    address_line1: "1501 Wynkoop St",
    city: "Denver",
    state: "CO",
    zip_code: "80202",
    neighborhood: "LoDo",
    walk_score: 92,
    latitude: 39.7525,
    longitude: -104.9997,
    landlord_name: landlords[1].name,
    landlord_avatar: landlords[1].avatar,
  },
  {
    unit_id: "mock-005",
    unit_number: "5",
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2200,
    rent_price: 4200,
    deposit_amount: 4200,
    available_from: new Date(Date.now() + 60 * 86400000).toISOString(),
    images: imageSets.portland,
    amenities: ["Washer/Dryer", "Fenced Yard", "Fireplace", "Garage", "Deck", "Basement"],
    property_id: "prop-003",
    property_title: "Alberta Arts Townhouse",
    property_type: "townhouse",
    address_line1: "2414 NE Alberta St",
    city: "Portland",
    state: "OR",
    zip_code: "97211",
    neighborhood: "Alberta Arts District",
    walk_score: 88,
    latitude: 45.5592,
    longitude: -122.6419,
    landlord_name: landlords[2].name,
    landlord_avatar: landlords[2].avatar,
  },
  {
    unit_id: "mock-006",
    unit_number: "12",
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 650,
    rent_price: 1495,
    deposit_amount: 1495,
    available_from: new Date(Date.now() + 10 * 86400000).toISOString(),
    images: imageSets.nashville,
    amenities: ["Laundry on Site", "Gym", "Pool", "Coffee Bar"],
    property_id: "prop-004",
    property_title: "The Gulch Residences",
    property_type: "apartment",
    address_line1: "500 11th Ave S",
    city: "Nashville",
    state: "TN",
    zip_code: "37203",
    neighborhood: "The Gulch",
    walk_score: 85,
    latitude: 36.1529,
    longitude: -86.7905,
    landlord_name: landlords[3].name,
    landlord_avatar: landlords[3].avatar,
  },
  {
    unit_id: "mock-007",
    unit_number: "805",
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1150,
    rent_price: 2800,
    deposit_amount: 2800,
    available_from: new Date(Date.now() + 5 * 86400000).toISOString(),
    images: imageSets.nashville,
    amenities: ["In-unit Laundry", "Gym", "Pool", "Valet Trash", "Covered Parking", "Smart Locks"],
    property_id: "prop-004",
    property_title: "The Gulch Residences",
    property_type: "apartment",
    address_line1: "500 11th Ave S",
    city: "Nashville",
    state: "TN",
    zip_code: "37203",
    neighborhood: "The Gulch",
    walk_score: 85,
    latitude: 36.1529,
    longitude: -86.7905,
    landlord_name: landlords[3].name,
    landlord_avatar: landlords[3].avatar,
  },
  {
    unit_id: "mock-008",
    unit_number: "3E",
    bedrooms: 0,
    bathrooms: 1,
    square_feet: 420,
    rent_price: 1200,
    deposit_amount: 1200,
    available_from: new Date(Date.now() + 3 * 86400000).toISOString(),
    images: imageSets.brooklyn,
    amenities: ["Elevator", "Laundry on Site", "Roof Access", "Bike Room"],
    property_id: "prop-005",
    property_title: "Williamsburg Lofts",
    property_type: "studio",
    address_line1: "234 N 12th St",
    city: "Brooklyn",
    state: "NY",
    zip_code: "11211",
    neighborhood: "Williamsburg",
    walk_score: 98,
    latitude: 40.7178,
    longitude: -73.9551,
    landlord_name: landlords[0].name,
    landlord_avatar: landlords[0].avatar,
  },
  {
    unit_id: "mock-009",
    unit_number: "8F",
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 875,
    rent_price: 3200,
    deposit_amount: 3200,
    available_from: new Date(Date.now() + 45 * 86400000).toISOString(),
    images: imageSets.brooklyn,
    amenities: ["In-unit Laundry", "Doorman", "Gym", "Rooftop", "Storage"],
    property_id: "prop-005",
    property_title: "Williamsburg Lofts",
    property_type: "apartment",
    address_line1: "234 N 12th St",
    city: "Brooklyn",
    state: "NY",
    zip_code: "11211",
    neighborhood: "Williamsburg",
    walk_score: 98,
    latitude: 40.7178,
    longitude: -73.9551,
    landlord_name: landlords[0].name,
    landlord_avatar: landlords[0].avatar,
  },
  {
    unit_id: "mock-010",
    unit_number: "204",
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 1680,
    rent_price: 3750,
    deposit_amount: 3750,
    available_from: new Date(Date.now() + 14 * 86400000).toISOString(),
    images: imageSets.brooklyn.slice(0, 3),
    amenities: ["Washer/Dryer", "Backyard", "Dishwasher", "Central AC", "Storage", "Pet Friendly"],
    property_id: "prop-001",
    property_title: "The Austonian",
    property_type: "condo",
    address_line1: "200 Congress Ave",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    neighborhood: "Downtown",
    walk_score: 95,
    latitude: 30.2672,
    longitude: -97.7431,
    landlord_name: landlords[0].name,
    landlord_avatar: landlords[0].avatar,
  },
]

const mockReviews: MockReview[] = [
  {
    id: "rev-001",
    unit_id: "mock-001",
    reviewer_id: "user-001",
    overall_rating: 5,
    title: "Amazing location!",
    comment: "Love living in the heart of Austin. The amenities are top-notch and the staff is incredibly responsive. Walking distance to everything.",
    reviewer_name: "Alex P.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=alex",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "rev-002",
    unit_id: "mock-001",
    reviewer_id: "user-002",
    overall_rating: 4,
    title: "Great building, pricey parking",
    comment: "The unit is beautiful and well-maintained. The only downside is parking costs extra. Otherwise, a fantastic place to live.",
    reviewer_name: "Jordan K.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=jordan",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "rev-003",
    unit_id: "mock-003",
    reviewer_id: "user-003",
    overall_rating: 5,
    title: "Best decision we made",
    comment: "Moved here from out of state and LoDo Heights made it easy. The concierge helped us settle in, and the views of the mountains are incredible.",
    reviewer_name: "Morgan T.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=morgan",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "rev-004",
    unit_id: "mock-003",
    reviewer_id: "user-004",
    overall_rating: 4,
    title: "Great neighborhood",
    comment: "LoDo has so many restaurants and bars within walking distance. The unit itself is modern and comfortable. Parking situation could be better.",
    reviewer_name: "Casey L.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=casey",
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "rev-005",
    unit_id: "mock-005",
    reviewer_id: "user-005",
    overall_rating: 5,
    title: "Perfect for our family",
    comment: "The Alberta Arts neighborhood is so vibrant. Our kids love the backyard and we love the walkability. The townhouse itself is spacious.",
    reviewer_name: "Riley S.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=riley",
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: "rev-006",
    unit_id: "mock-006",
    reviewer_id: "user-006",
    overall_rating: 3,
    title: "Decent starter place",
    comment: "Good value for the Gulch area. The unit is a bit small but the building amenities make up for it. Some noise from the street.",
    reviewer_name: "Taylor M.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=taylor",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "rev-007",
    unit_id: "mock-008",
    reviewer_id: "user-007",
    overall_rating: 4,
    title: "Classic Williamsburg spot",
    comment: "You can't beat the walkability. The studio is compact but well-designed. Roof access is a huge plus for summer hangs.",
    reviewer_name: "Avery D.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=avery",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "rev-008",
    unit_id: "mock-009",
    reviewer_id: "user-008",
    overall_rating: 5,
    title: "Worth every penny",
    comment: "Best building I've ever lived in. The doorman knows everyone by name, the gym is legit, and the rooftop views of the city are stunning.",
    reviewer_name: "Drew H.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=drew",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "rev-009",
    unit_id: "mock-002",
    reviewer_id: "user-009",
    overall_rating: 5,
    title: "Luxury living",
    comment: "The Austonian sets the standard. From the valet to the pool, everything feels premium. Our 2-bedroom has plenty of space.",
    reviewer_name: "Sam W.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=sam",
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
  {
    id: "rev-010",
    unit_id: "mock-007",
    reviewer_id: "user-010",
    overall_rating: 4,
    title: "Love the Gulch",
    comment: "Great location near music venues and restaurants. The smart home features are a nice touch. Would give 5 stars if parking was included.",
    reviewer_name: "Blake R.",
    reviewer_avatar: "https://i.pravatar.cc/64?u=blake",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
]

function filterListings(
  listings: MockListing[],
  params: URLSearchParams
): MockListing[] {
  let filtered = [...listings]

  const city = params.get("city")
  if (city)
    filtered = filtered.filter((l) =>
      l.city.toLowerCase().includes(city.toLowerCase())
    )

  const state = params.get("state")
  if (state)
    filtered = filtered.filter(
      (l) => l.state.toLowerCase() === state.toLowerCase()
    )

  const minPrice = params.get("minPrice")
  if (minPrice) filtered = filtered.filter((l) => l.rent_price >= parseInt(minPrice))

  const maxPrice = params.get("maxPrice")
  if (maxPrice) filtered = filtered.filter((l) => l.rent_price <= parseInt(maxPrice))

  const bedrooms = params.get("bedrooms")
  if (bedrooms) filtered = filtered.filter((l) => l.bedrooms >= parseInt(bedrooms))

  const propertyType = params.get("propertyType")
  if (propertyType)
    filtered = filtered.filter(
      (l) => l.property_type.toLowerCase() === propertyType.toLowerCase()
    )

  filtered.sort((a, b) => a.rent_price - b.rent_price)

  return filtered
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  }
}

export function getMockListings(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12")))

  const filtered = filterListings(mockListings, searchParams)
  return paginate(filtered, page, limit)
}

export function getMockListing(id: string) {
  const listing = mockListings.find((l) => l.unit_id === id)
  if (!listing) return null

  const reviews = mockReviews.filter((r) => r.unit_id === id)
  const similar = mockListings.filter(
    (l) => l.property_id === listing.property_id && l.unit_id !== id
  )

  return { ...listing, reviews, similar }
}
