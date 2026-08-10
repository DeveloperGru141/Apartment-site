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
    role: "Off-Plan Sales Executive",
    photo: portrait("/api/portraits/men/75.jpg"),
    bio: "Femi specialises in pre-construction towers in Eko Atlantic and the new estates, walking buyers through every stage payment and milestone.",
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
    role: "Land & Commercial Lead",
    photo: portrait("/api/portraits/men/86.jpg"),
    bio: "Chidi has matched serious buyers with everything from Banana Island waterfront to industrial clusters — always with a full title dossier.",
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
