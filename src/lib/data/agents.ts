const portrait = (path: string) => `https://randomuser.me${path}?q=80`

export interface Agent {
  id: string
  slug: string
  name: string
  role: string
  photo: string
  bio: string
  whatsapp: string
  email?: string
}

export const agents: Agent[] = [
  {
    id: "agent-salami",
    slug: "salami-ademola",
    name: "Salami Ademola",
    role: "Founder & Principal Partner",
    photo: "/images/salami-ademola.png",
    bio: "Salami leads HORIZON's advisory desk in Lagos, pairing deep knowledge of the island market with a white-glove, end-to-end service for buyers, sellers, and tenants.",
    whatsapp: "2348012345009",
    email: "ademola@horizon.ng",
  },
  {
    id: "agent-adaeze",
    slug: "adaeze-chukwuma",
    name: "Adaeze Chukwuma",
    role: "Head of Residential Sales",
    photo: portrait("/api/portraits/women/44.jpg"),
    bio: "Adaeze has guided over 300 families into homes across Ikoyi and the islands, pairing sharp market data with a patient, personal hand.",
    whatsapp: "2348012345001",
    email: "adaeze@horizon.ng",
  },
  {
    id: "agent-tunde",
    slug: "tunde-lawal",
    name: "Tunde Lawal",
    role: "Residential Sales Executive",
    photo: portrait("/api/portraits/men/32.jpg"),
    bio: "Tunde knows every block of Old Ikoyi by heart, and his weekend walkthroughs have closed more island sales than anyone on the desk.",
    whatsapp: "2348012345002",
  },
  {
    id: "agent-ngozi",
    slug: "ngozi-okonkwo",
    name: "Ngozi Okonkwo",
    role: "Head of Rentals",
    photo: portrait("/api/portraits/women/68.jpg"),
    bio: "Ngozi built the rentals desk into the island's most responsive leasing team, with prime stock turning over in days rather than weeks.",
    whatsapp: "2348012345003",
    email: "ngozi@horizon.ng",
  },
  {
    id: "agent-femi",
    slug: "femi-adebayo",
    name: "Femi Adebayo",
    role: "Luxury Residential Specialist",
    photo: portrait("/api/portraits/men/75.jpg"),
    bio: "Femi specialises in luxury penthouses and sky suites across Eko Atlantic and the island, guiding clients through viewings and handovers.",
    whatsapp: "2348012345004",
  },
  {
    id: "agent-hadiza",
    slug: "hadiza-bello",
    name: "Hadiza Bello",
    role: "Senior Sales Executive",
    photo: portrait("/api/portraits/women/12.jpg"),
    bio: "Hadiza manages high-net-worth relocations from abroad, from preview materials and video tours to closing logistics and handover.",
    whatsapp: "2348012345005",
    email: "hadiza@horizon.ng",
  },
  {
    id: "agent-chidi",
    slug: "chidi-okafor",
    name: "Chidi Okafor",
    role: "Commercial & Corporate Lead",
    photo: portrait("/api/portraits/men/86.jpg"),
    bio: "Chidi matches corporate and private investors with prime office towers, executive retail spaces, and luxury commercial assets.",
    whatsapp: "2348012345006",
  },
  {
    id: "agent-folake",
    slug: "folake-adeniran",
    name: "Folake Adeniran",
    role: "Client Success Manager",
    photo: portrait("/api/portraits/women/33.jpg"),
    bio: "Folake is the reason clients come back: she runs the concierge desk and follows up long after the keys have been handed over.",
    whatsapp: "2348012345007",
    email: "folake@horizon.ng",
  },
  {
    id: "agent-emeka",
    slug: "emeka-obi",
    name: "Emeka Obi",
    role: "Investments & Diaspora",
    photo: portrait("/api/portraits/men/52.jpg"),
    bio: "Emeka advises diaspora investors on portfolio structure, yield, and exit — with a WhatsApp line that never sleeps.",
    whatsapp: "2348012345008",
  },
]
