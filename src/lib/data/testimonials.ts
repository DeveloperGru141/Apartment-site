export interface Testimonial {
  quote: string
  name: string
  context?: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "From the first call to the signing table, the team handled everything. We closed on our Ikoyi duplex in under six weeks — I didn't lift a finger except to sign.",
    name: "Obinna & Adaeze Onyemaechi",
    context: "Bought a duplex in Ikoyi",
    rating: 5,
  },
  {
    quote:
      "They found me a Banana Island home we never believed we could afford with a jetty, and renegotiated the price twice on our behalf. Unbelievable patience.",
    name: "Maria Fernanda Silva",
    context: "Relocated from Lisbon",
    rating: 5,
  },
  {
    quote:
      "Renting in Lekki used to give me anxiety. This team shortlisted five homes, negotiated the lease, and even arranged the surveyor and cleaning before we moved in.",
    name: "Tolu O.",
    context: "Rented in Lekki Phase 1",
    rating: 4,
  },
  {
    quote:
      "I bought a plot on the mainland through their lands desk. Every title document was presented and explained before we paid a kobo — that rarely happens here.",
    name: "Dr. Ikenna Osahor",
    context: "Bought land in Ikeja GRA",
    rating: 5,
  },
  {
    quote:
      "They walked us through an off-plan tower purchase with zero pressure. Three years later we took delivery exactly on schedule, exactly to spec.",
    name: "Olamide & Yinka B.",
    context: "Bought off-plan in Eko Atlantic",
    rating: 4,
  },
  {
    quote:
      "Our corporate office search was under a ridiculous deadline. They had three full-floor options, financial models, and inspection reports ready in five days.",
    name: "Chidi Ebo",
    context: "Leased commercial space on the Island",
    rating: 5,
  },
  {
    quote:
      "The most refreshing thing: they never tried to hurry us. Three tours, two weekend follow-ups, and a family meeting later, we found our forever bungalow.",
    name: "Ronke & Femi A.",
    context: "Bought in Lekki Phase 1",
    rating: 5,
  },
]
