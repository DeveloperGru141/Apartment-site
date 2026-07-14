# Apartment-site - Luxury Apartment Rental Platform

A modern, responsive landing page for a luxury apartment rental SaaS platform built with Next.js 15, TypeScript, and Tailwind CSS v4.

## 🏗️ Project Overview

**Apartment-site** is the marketing landing page for "LUXORA" - a premium apartment rental platform targeting the US market. The platform focuses exclusively on luxury rentals (no buying/selling), featuring digital lease signatures, multi-currency payment support, and a concierge-level user experience.

### Key Features
- **Luxury Brand Identity** - "Where Dreams Meet Reality" tagline with premium visual design
- **Responsive Design** - Mobile-first approach with optimized layouts across all breakpoints
- **Component Architecture** - Reusable, maintainable components following atomic design principles
- **Design System** - Centralized design tokens (colors, typography, spacing) via Tailwind CSS v4
- **Performance Optimized** - Static generation, optimized images, minimal bundle size

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 15.x (App Router) |
| **Language** | TypeScript | 5.7.x |
| **Styling** | Tailwind CSS | 4.x |
| **Fonts** | Google Fonts (self-hosted via next/font) | Plus Jakarta Sans + Inter |
| **Package Manager** | npm | 10.x |
| **Build Tool** | Turbopack | Built-in |

## 🎨 Design System

### Color Palette
Defined in `src/app/globals.css` as CSS custom properties:

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#FFFFFF` | Primary backgrounds, white sections |
| `--color-bg-alt` | `#F9F9F9` | Alternate section backgrounds |
| `--color-bg-dark` | `#111111` | Dark footer, primary text |
| `--color-text-primary` | `#111111` | Headlines, primary CTAs |
| `--color-text-muted` | `#666666` | Secondary text, labels, meta |
| `--color-text-body` | `#555555` | Body copy, descriptions |
| `--color-text-meta` | `#333333` | Stat labels, fine print |
| `--color-accent` | `#111111` | Brand accent (same as primary) |

### Typography
Loaded via `next/font/google` in `src/app/layout.tsx`:

| Font | Weights | CSS Variable | Usage |
|------|---------|--------------|-------|
| **Plus Jakarta Sans** | 500, 700, 800 | `--font-heading` | All headings (H1-H3), kickers, logo |
| **Inter** | 400, 500, 600 | `--font-body` | Body text, navigation, buttons, metadata |

### Spacing & Layout
- **Container**: `max-w-7xl` (1280px) with responsive padding (`px-6 md:px-16`)
- **Section Padding**: `py-16 md:py-32` (tight) / `py-24 md:py-32` (standard)
- **Grid System**: Tailwind's responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

## 📁 Project Structure

```
apartment-site/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Route group for marketing pages
│   │   │   ├── layout.tsx         # Marketing layout (Navbar + Footer)
│   │   │   └── page.tsx           # Home page composition
│   │   ├── globals.css            # Tailwind v4 theme + design tokens
│   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   └── page.tsx               # Root redirect
│   ├── components/
│   │   ├── landing/               # Landing page sections
│   │   │   ├── hero.tsx
│   │   │   ├── about-stats.tsx
│   │   │   ├── services.tsx
│   │   │   ├── portfolio.tsx
│   │   │   ├── concierge.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── blog.tsx
│   │   │   ├── photo-ribbon.tsx
│   │   │   ├── cta-section.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navbar.tsx
│   │   └── shared/                # Reusable UI components
│   │       ├── Section.tsx        # Section wrapper + header utilities
│   │       └── UIComponents.tsx   # Card, link, stat components
│   ├── lib/
│   │   ├── images.ts              # Centralized Unsplash image URLs
│   │   ├── footer-links.ts        # Footer navigation constants
│   │   └── utils.ts               # Utility functions (cn helper)
│   └── types/                     # TypeScript type definitions
├── public/                        # Static assets
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## 🧩 Component Architecture

### Shared Components (`src/components/shared/`)

**Section.tsx** - Layout primitives:
- `Section` - Wrapper with variant (`primary`/`alt`) and padding (`default`/`tight`)
- `SectionHeader` - Consistent section titles with optional subtitle, alignment
- `SplitHeading` - Multi-line headings with `<br />` splits

**UIComponents.tsx** - Reusable cards & links:
- `ViewProjectLink` - Styled "VIEW PROJECT" link with underline animation
- `ArticleCard` - Blog articles (featured + compact variants)
- `StatCard` - Key metrics display (value + label)
- `ServiceCard` - Service offering with image overlay
- `PortfolioCard` - Portfolio items with alternating layout
- `ConciergeStep` - Numbered process steps

### Landing Sections (`src/components/landing/`)

| Component | Description | Key Features |
|-----------|-------------|--------------|
| `Navbar` | Sticky header with blur gradient | Mobile drawer, branded logo, CTA |
| `Hero` | Full-screen hero with CTA | Background image, dark overlay, responsive text |
| `AboutStats` | Brand story + metrics + gallery | 3-column stats, asymmetric image grid |
| `Services` | 3-column service cards | Hover scale, dark overlay, white text |
| `Portfolio` | Alternating image/text rows | 4 projects, "VIEW PROJECT" links |
| `Concierge` | 3-step process + lifestyle image | Large step numbers, descriptive copy |
| `Testimonials` | Single centered quote | Avatar, name, title, italic styling |
| `Blog` | Featured + compact article cards | Asymmetric 2-col layout |
| `PhotoRibbon` | Infinite horizontal scroll | 12 images (6 duplicated), CSS animation |
| `CtaSection` | Final CTA + 4-image grid | "Let's Create Homes With Meaning" |
| `Footer` | 4-column dark footer | Quick links, policies, social, copyright |

## 📦 Centralized Constants

### Images (`src/lib/images.ts`)
All Unsplash URLs centralized with semantic keys:
```typescript
export const IMAGES = {
  hero: { background: "..." },
  about: { main: "...", gallery: ["...", "...", "..."] },
  services: { concierge: "...", interiors: "...", amenities: "..." },
  portfolio: { penthouse: "...", residence: "...", apartment: "...", villa: "..." },
  concierge: { lifestyle: "..." },
  testimonials: { avatar: "..." },
  blog: { featured: "...", penthouse: "...", sustainability: "..." },
  ribbon: [...], // 6 images for infinite scroll
  cta: [...],    // 4 images for CTA grid
} as const;
```

### Footer Links (`src/lib/footer-links.ts`)
```typescript
export const QUICK_LINKS = ["Home", "Services", "Portfolio", "About Us", "Blog"];
export const POLICIES = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"];
export const SOCIAL = ["Instagram", "LinkedIn", "Twitter", "Facebook"];
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 10+

### Installation
```bash
# Clone the repository
git clone https://github.com/DeveloperGru141/Apartment-site.git
cd apartment-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build (static export) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Connect to Vercel
npx vercel
```

### Static Export
```bash
npm run build
# Output in /out directory
```

### Environment Variables
No environment variables required for the landing page. Backend integration (Supabase, Stripe) will be configured separately.

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns | Notes |
|------------|-------|---------|-------|
| `mobile` | < 640px | 1 | Stacked layouts, hidden nav links |
| `tablet` | 640-1023px | 2 | Side-by-side grids, drawer menu |
| `desktop` | 1024-1279px | 3 | Full layouts, inline nav |
| `large` | ≥ 1280px | 3-4 | Max container width, generous spacing |

### Mobile-Specific Patterns
- **Navbar**: Hamburger menu → full-screen drawer (fixed inset, white bg)
- **Grids**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Images**: Reduced heights (`h-40 md:h-64`, `h-72 md:h-96`)
- **Typography**: `text-4xl sm:text-5xl md:text-7xl` scaling
- **Spacing**: `py-16 md:py-32` → `py-16` on mobile

## ♿ Accessibility

- Semantic HTML5 elements (`header`, `main`, `section`, `footer`, `nav`)
- Alt text on all images (descriptive, not keyword-stuffed)
- Focus-visible states on interactive elements
- Color contrast ratios meet WCAG AA (dark text on light bg)
- ARIA labels on icon-only buttons (hamburger, close)
- Keyboard-navigable mobile drawer

## 🔧 Configuration Files

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
```

### `tsconfig.json`
- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- Next.js plugin for App Router

### `globals.css` (Tailwind v4)
```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-bg-primary: #ffffff;
  --color-bg-alt: #f9f9f9;
  --color-bg-dark: #111111;
  --color-text-primary: #111111;
  --color-text-muted: #666666;
  --color-text-body: #555555;
  --color-text-meta: #333333;
  --color-accent: #111111;

  /* Fonts */
  --font-heading: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-bg-primary text-text-body font-body antialiased; }
}

@keyframes scroll { ... }
.animate-scroll { animation: scroll 40s linear infinite; }
.animate-scroll:hover { animation-play-state: paused; }
```

## 📋 Roadmap / Next Steps

- [ ] **Backend Integration**
  - Supabase: Auth (magic links, OAuth), Database (profiles, listings, leases), Storage
  - Stripe Connect: Multi-party payments, payouts to landlords
  - Digital signatures: DocuSign API or open-source alternative

- [ ] **Dashboard & App Routes**
  - Tenant dashboard (saved searches, applications, lease management)
  - Landlord portal (listing management, tenant screening, payouts)
  - Admin panel (moderation, analytics, support)

- [ ] **Enhanced Features**
  - Map-based search (Mapbox/Google Maps)
  - Virtual tours (3D/360° media)
  - AI-powered recommendations
  - Multi-language (EN/ES for US market)

- [ ] **Testing & Quality**
  - Unit tests (Vitest + React Testing Library)
  - E2E tests (Playwright)
  - Visual regression (Chromatic)

- [ ] **Performance**
  - Image optimization (next/image with blur placeholders)
  - Font subsetting & preload
  - Service worker for offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- TypeScript strict mode
- ESLint + Prettier (run `npm run lint`)
- Conventional commits (feat, fix, chore, docs, refactor)

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash** - High-quality placeholder photography
- **Google Fonts** - Plus Jakarta Sans & Inter
- **Tailwind CSS** - Utility-first styling
- **Next.js Team** - React framework
- **Vercel** - Deployment platform

---

**Built with ❤️ for the LUXORA brand** — *Where Dreams Meet Reality*