// Unsplash image configuration
// Use consistent image sizes and quality across all components

export const Images = {
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  livingRoom: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  kitchen: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80",
  bathroom: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  concierge: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
  penthouse: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=80",
  residence: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=900&q=80",
  apartment: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=80",
  oceanfront: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
  client: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  confort: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
  service1: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  service2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  service3: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
  blog1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80",
  blog2: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80",
  blog3: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80",
  ribbon1: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  ribbon2: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
  ribbon3: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
  ribbon4: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  ribbon5: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
  ribbon6: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=400&q=80",
  cta1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
  cta2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80",
  cta3: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&q=80",
  cta4: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300&q=80",
} as const;

export type ImageKey = keyof typeof Images;

export function getImage(key: ImageKey): string {
  return Images[key];
}

export function getImageWithFallback(key: string, fallback: string = Images.hero): string {
  return Images[key as ImageKey] || fallback;
}