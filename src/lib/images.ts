const w = (id: string, width = 800) => `https://images.unsplash.com/photo-${id}?w=${width}&q=80`

export const images = {
  hero: w('1600596542815-ffad4c1539a9', 1920),

  aboutStats: [
    w('1600585154340-be6161a56a0c', 600),
    w('1600573472550-8090b5e0745e', 400),
    w('1600607687939-ce8a6c25118c', 400),
  ],

  services: [
    w('1586023492125-27b2c045efd7', 600),
    w('1618221195710-dd6b41faaea6', 600),
    w('1618220179428-22790b461013', 600),
  ],

  blog: [
    w('1582268611958-ebfd161ef9cf', 700),
    w('1560448204-e02f11c3d0e2', 400),
    w('1522708323590-d24dbb6b0267', 400),
  ],

  ctaSection: [
    w('1600585154526-990dced4db0d', 300),
    w('1600585152915-d208bec867a1', 300),
    w('1600573472591-ee6b68d14c68', 300),
    w('1600607687644-aac4c3eac7f4', 300),
  ],

  concierge: w('1600573472592-401b489a3cdc', 1600),

  portfolio: [
    w('1600607687920-4e2a09cf159d', 900),
    w('1600566752355-35792bedcfea', 900),
    w('1600566753190-17f0baa2a6c3', 900),
    w('1600047509358-9dc75507daeb', 900),
  ],

  photoRibbon: [
    w('1600047509807-ba8f99d2cdde', 400),
    w('1600566753086-00f18f4f7c1a', 400),
    w('1600585154363-67eb9e2e2099', 400),
    w('1600585154526-990dced4db0d', 400),
    w('1586023492125-27b2c045efd7', 400),
    w('1582268611958-ebfd161ef9cf', 400),
  ],

  listings: {
    austin: [
      w('1600596542815-ffad4c1539a9'),
      w('1600585154340-be6161a56a0c'),
      w('1560448204-e02f11c3d0e2'),
      w('1522708323590-d24dbb6b0267'),
    ],
    denver: [
      w('1600607687939-ce8a6c25118c'),
      w('1600566753086-00f18f4f7c1a'),
      w('1600573472550-8090b5e0745e'),
      w('1600047509807-ba8f99d2cdde'),
    ],
    portland: [
      w('1600585152915-d208bec867a1'),
      w('1600573472591-ee6b68d14c68'),
      w('1600566752355-35792bedcfea'),
      w('1600607687644-aac4c3eac7f4'),
    ],
    nashville: [
      w('1586023492125-27b2c045efd7'),
      w('1600573472592-401b489a3cdc'),
      w('1600566753190-17f0baa2a6c3'),
      w('1600047509358-9dc75507daeb'),
    ],
    brooklyn: [
      w('1600585154363-67eb9e2e2099'),
      w('1582268611958-ebfd161ef9cf'),
      w('1600607687920-4e2a09cf159d'),
      w('1618220179428-22790b461013'),
    ],
  },

  listingCardFallback: w('1560448204-e02f11c3d0e2', 600),
  listingDetailFallback: w('1600596542815-ffad4c1539a9', 1200),

  authLayout: w('1600607687939-ce8a6c25118c', 1600),
} as const

export const LAGOS_IMAGES = {
  hero: {
    main: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
    night: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
  },

  neighborhoods: {
    ikoyi: {
      title: 'Ikoyi',
      sub: 'Bourdillon, Alexander & Old Ikoyi',
      count: '42 Exclusive Properties',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    },
    bananaIsland: {
      title: 'Banana Island',
      sub: 'Zone A Private Waterfront Estates',
      count: '18 Ultra-Luxury Mansions',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    },
    victoriaIsland: {
      title: 'Victoria Island',
      sub: 'Ozumba Mbadiwe & Ahmadu Bello',
      count: '31 Lagoon-View Apartments',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
    },
    lekkiPhase1: {
      title: 'Lekki Phase 1',
      sub: 'Admiralty Way & Freedom Way',
      count: '54 Smart Maisonettes',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    ekoAtlantic: {
      title: 'Eko Atlantic City',
      sub: 'A&A Towers & Eko Pearl Sky Suites',
      count: '22 Oceanfront Towers',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    },
    ikejaGra: {
      title: 'Ikeja GRA',
      sub: 'Isaac John & Executive Mainland Estates',
      count: '15 Gated Private Compounds',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    },
  },

  categories: {
    penthouses: 'https://i.pinimg.com/736x/19/f0/3d/19f03d8b5a581cae3ed9d31e32e82fd2.jpg',
    waterfront: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    maisonettes: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
  },

  listings: [
    {
      id: 'bourdillon-sky-penthouse',
      title: '4 Bedroom Penthouse',
      location: 'Bourdillon Road, Ikoyi, Lagos',
      price: '₦ 150,000,000 / yr',
      status: 'FOR RENT',
      type: 'Penthouse',
      beds: 4,
      baths: 4.5,
      sqft: 4200,
      image: 'https://i.pinimg.com/736x/19/f0/3d/19f03d8b5a581cae3ed9d31e32e82fd2.jpg',
      badge: 'FEATURED',
    },
    {
      id: 'banana-island-waterfront-mansion',
      title: '6 Bedroom Waterfront Mansion & Jetty',
      location: 'Zone A, Banana Island, Ikoyi, Lagos',
      price: '₦ 1,850,000,000',
      status: 'FOR_SALE',
      type: 'Waterfront Villa',
      beds: 6,
      baths: 7,
      sqft: 8500,
      image: 'https://images.unsplash.com/photo-1777914467875-6cd2ca7b82ba?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2F0ZXJmcm9udCUyMG1hbnNpb258ZW58MHx8MHx8fDA%3D',
      badge: 'EXCLUSIVE',
    },
    {
      id: 'ozumba-mbadiwe-suite',
      title: '3 Bedroom Lagoon View Apartment',
      location: 'Ozumba Mbadiwe, Victoria Island, Lagos',
      price: '₦ 85,000,000 / yr',
      status: 'FOR RENT',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      sqft: 2900,
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
      badge: 'LAGOON VIEW',
    },
    {
      id: 'freedom-way-maisonette',
      title: '3 Bedroom Smart Maisonette',
      location: 'Freedom Way, Lekki Phase 1, Lagos',
      price: '₦ 45,000,000 / yr',
      status: 'FOR RENT',
      type: 'Maisonette',
      beds: 3,
      baths: 3.5,
      sqft: 2400,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      badge: 'SMART HOME',
    },
    {
      id: 'a-and-a-tower-eko-atlantic',
      title: '3 Bedroom Oceanfront Sky Residence',
      location: 'A&A Towers, Eko Atlantic City, Lagos',
      price: '₦ 780,000,000',
      status: 'FOR SALE',
      type: 'Sky Suite',
      beds: 3,
      baths: 3.5,
      sqft: 3100,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      badge: 'OCEANFRONT',
    },
    {
      id: 'isaac-john-gra-villa',
      title: '5 Bedroom Executive Detached Villa',
      location: 'Isaac John Street, Ikeja GRA, Lagos',
      price: '₦ 650,000,000',
      status: 'FOR SALE',
      type: 'Villa',
      beds: 5,
      baths: 5.5,
      sqft: 6000,
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
      badge: 'MAINLAND PRIME',
    },
  ],
}
