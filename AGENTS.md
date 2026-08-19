# HORIZON — Apartment Rental Platform

## 1. Executive Summary & Architecture

This repository contains the **HORIZON** luxury apartment rental platform. Built with **Next.js 16 (App Router)**, **TypeScript 5.7+**, and **Tailwind CSS v4**.

All automated agents and execution flows MUST maintain strict adherence to Next.js App Router patterns, atomic component structure, strict type safety, and fluid View Transitions.

### Current State: Single-Page Landing (Supabase Disconnected)
The product is currently **stripped to a single static landing page** at `/`. The Supabase backend (schema, seed data, RLS, storage) is **intact in the database and in `supabase/migrations/`** but **fully disconnected from the frontend** — there is zero Supabase code in `src/` and no runtime dependency on the database. The site is fully static: it prerenders at build time and needs no environment variables.

### Primary Tech Stack & Structure
- **Framework:** Next.js 16.x (App Router, Turbopack)
- **Language:** TypeScript 5.7.x
- **Styling:** Tailwind CSS v4 (`@theme` variables in `src/app/globals.css`)
- **Data:** Static fixture files in `src/lib/data/` (properties, agents, testimonials, journal). The landing page renders entirely from these — no fetch calls.
- **Auth / Backend:** none active. Supabase schema + seed live in `supabase/migrations/` and `scripts/seed-properties.ts` as documentation for reconnection.
- **Transitions:** Native View Transitions API via custom `ViewTransition` provider (`src/components/view-transition.tsx`)
- **Path Alias:** `@/*` maps directly to `src/*`

---

## 2. Routing Plan

### Now — landing-only routing
| Route | Purpose | Prerender |
|---|---|---|
| `/` | Single-page landing; sections navigated by **anchor IDs** | Static |

Anchor map (Navbar/Footer scroll targets): `#top` (hero) · `#portfolio` (FeaturedPortfolio) · `#neighborhoods` (NeighborhoodShowcase) · `#concierge` (ConciergeValueProp) · `#team` (TeamSpotlight) · `#journal` (JournalInsights). Navbar renders `<a href="#...">` links; no route links exist anywhere.

Everything else → plain 404 (default `src/app/not-found.tsx`). No redirects, no stubs.

### Future — route map for the rebuild (URL shape is final)
Reconnect in phases; each phase restores the deleted code from git history + re-adds the Supabase libs:
- **Phase 1 — Browse:** `/properties`, `/properties/[slug]` (restore `src/lib/supabase/anon.ts`, `src/lib/property-live.ts` — cached queries filtered to `For Rent`/`For Sale`, non-land types, `rental|commercial|resale` categories)
- **Phase 2 — Content:** `/agents`, `/agents/[slug]`, `/journal`, `/journal/[slug]`, `/legal/[slug]`
- **Phase 3 — Seller platform:** `/sell`, `/auth/login`, `/auth/sign-up`, `/dashboard`, `/dashboard/listings/new`, `/dashboard/listings/[id]/edit` (restore `src/proxy.ts`, SSR/client Supabase clients, server actions)
- DB reconnection: the live Supabase project is untouched; `supabase/migrations/20260818090000_seller_properties.sql` + `scripts/seed-properties.ts` document the schema.

---

## 3. Mandatory Coding Patterns & Rules

### A. Navigation & View Transitions
- **View Transition Provider:** The root layout (`src/app/layout.tsx`) wraps children in `<ViewTransition>`. Do not remove or duplicate this wrapper.
- **CSS:** View transition keyframes (`view-fade-in`, `view-fade-out`) are defined in `src/app/globals.css`. Respect the `prefers-reduced-motion` media query.

### B. Tailwind CSS v4 & Styling Standards
- Respect the design system tokens defined in `src/app/globals.css`:
  - Primary Background: `bg-bg-primary` (#FFFFFF)
  - Dark/Text Accent: `bg-bg-dark` / `text-text-primary` (#111111)
  - Headings Font: `font-heading` (Plus Jakarta Sans)
  - Body Font: `font-body` (Inter)
- DO NOT invent arbitrary hex values inline if standard theme tokens exist in `globals.css`.

### C. Component & Data Architecture
- Place shared layout primitives in `src/components/shared/`, navigation in `src/components/navigation/`, home sections in `src/components/home/`, listing sections in `src/components/properties/`.
- Edition of record for agents, testimonials, journal, properties: `src/lib/data/`. Images must come from the validated pool in `src/lib/images.ts` (`LAGOS_IMAGES`) — do not introduce unvalidated image URLs.
- **The landing page is the only page** and consumes `properties`, `agents`, `journalPosts` from `src/lib/data/` directly (server component importing the fixture). No data fetching layer exists.
- Default to React Server Components (RSC). Apply `'use client'` strictly to interactive leaf components (stateful filters, drawers, interactive cards).
- Client components that read search params (`useSearchParams`) MUST be wrapped in a `<Suspense>` boundary at their render site, or static prerendering of that route fails.

### D. TypeScript
- Explicitly type all component props, API parameters, and database query results.
- Zero `any` policy: avoid `any` types; use `unknown` with narrowing where needed. (Two intentional `eslint-disable` ref casts exist in `ScrollReveal.tsx` — keep them.)

---

## 4. Strict Guardrails (Forbidden Actions)

- ❌ DO NOT use the legacy Next.js Pages Router (`pages/` directory).
- ❌ DO NOT re-add Supabase code, `src/proxy.ts`, or dynamic fetching while the site is in landing-only mode — the site MUST stay fully static (no `force-dynamic`, no env-var requirements). The DB stays untouched; do not run migrations or seeds against it unless the user explicitly asks to reconnect.
- ❌ DO NOT add routes without updating the routing plan in section 2.
- ❌ DO NOT remove the `ViewTransition` wrapper from the root layout.
- ❌ DO NOT add new external image domains to `next.config.ts` without validating the URLs return HTTP 200.
- ❌ DO NOT expose `SUPABASE_SERVICE_ROLE_KEY` or other secrets — if Supabase is reconnected, keys stay server-only and in `.env.local` (gitignored).

---

## 5. Agent Execution Strategy

When executing tasks via OpenCode, follow this multi-phase workflow:

1. **Inspection Phase:** Read existing files in `src/app/`, `src/components/`, and `src/lib/` before introducing new components.
2. **Planning Phase (Plan Mode):** Draft a step-by-step implementation breakdown (checking imports, path aliases, and Tailwind v4 compatibility).
3. **Execution Phase (Act Mode):** Implement modular, clean TypeScript code following existing patterns.
4. **Validation Phase:** Verify that new features maintain smooth transitions and type checks pass via `npm run build`.

---

## 6. Definition of Done (Validation Checklist)

Before declaring any task complete, verify:

- [ ] TypeScript compiles cleanly via `npm run build` (expect all-static output).
- [ ] Tailwind utility classes reference existing design tokens (`bg-bg-primary`, `font-heading`, etc.).
- [ ] Mobile and desktop responsiveness adhere to project breakpoints (`sm:`, `md:`, `lg:`).
- [ ] No dead code, commented-out code, or console.log statements remain.
- [ ] Data in `src/lib/data/` stays internally consistent (unique IDs, filter values match unions).
- [ ] Changes are committed with a descriptive message.
