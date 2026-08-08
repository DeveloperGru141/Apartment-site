const POOL = [
  '1600596542815-ffad4c1539a9',
  '1600585154340-be6161a56a0c',
  '1560448204-e02f11c3d0e2',
  '1522708323590-d24dbb6b0267',
  '1600607687939-ce8a6c25118c',
  '1600566753086-00f18f4f7c1a',
  '1600573472550-8090b5e0745e',
  '1600047509807-ba8f99d2cdde',
  '1600585152915-d208bec867a1',
  '1600573472591-ee6b68d14c68',
  '1600566752355-35792bedcfea',
  '1600607687644-aac4c3eac7f4',
  '1586023492125-27b2c045efd7',
  '1600573472592-401b489a3cdc',
  '1600566753190-17f0baa2a6c3',
  '1600047509358-9dc75507daeb',
  '1600585154363-67eb9e2e2099',
  '1582268611958-ebfd161ef9cf',
  '1600607687920-4e2a09cf159d',
  '1618220179428-22790b461013',
]

function w(id: string, width = 800) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80`
}

export function getMockImages(id: string, count = 4): string[] {
  let hash = 0
  for (let i = 0; i < Math.min(8, id.length); i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }

  const start = Math.abs(hash) % POOL.length
  const result: string[] = []

  for (let i = 0; i < count; i++) {
    result.push(w(POOL[(start + i) % POOL.length]))
  }

  return result
}
