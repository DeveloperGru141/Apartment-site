# HORIZON — Apartment Rental Platform

## 1. Executive Summary & Architecture

This repository contains the **HORIZON** luxury apartment rental platform. Built with **Next.js 16 (App Router)**, **TypeScript 5.7+**, and **Tailwind CSS v4**.

All automated agents and execution flows MUST maintain strict adherence to Next.js App Router patterns, atomic component structure, strict type safety, and fluid View Transitions.

### Primary Tech Stack & Structure
- **Framework:** Next.js 16.x (App Router, Turbopack)
- **Language:** TypeScript 5.7.x
- **Styling:** Tailwind CSS v4 (`@theme` variables in `src/app/globals.css`)
- **Content / Data:** Static seed data in `src/lib/data/` (agents, testimonials, journal — the agent roster is code-managed) plus **live seller-submitted properties** in Supabase (Postgres + RLS + storage). The seed `properties.ts` file is the reference/fixture for `scripts/seed-properties.ts` (seed all 28 into the `properties` table).
- **Auth / Backend:** Supabase (sellers only — buyers browse anonymously). SSR client pair in `src/lib/supabase/` (`client.ts` browser, `server.ts` server), session refresh in `src/proxy.ts` (Next 16 renamed the `middleware` convention to `proxy`).
- **Transitions:** Native View Transitions API via custom `ViewTransition` provider (`src/components/view-transition.tsx`)
- **Path Alias:** `@/*` maps directly to `src/*`

---

## 2. Mandatory Coding Patterns & Rules

### A. Navigation & View Transitions
- **View Transition Provider:** The root layout (`src/app/layout.tsx`) wraps children in `<ViewTransition>`. Do not remove or duplicate this wrapper.
- **Shared Element Morphing:** When navigating from listing cards to detail views, apply dynamic inline `viewTransitionName` styling:
  ```tsx
  style={{ viewTransitionName: `listing-img-${unit_id}`, contain: "layout" }}
  ```
  Both the source (card thumbnail) and target (detail header image) MUST use the same name derived from the unit ID.
- **CSS:** View transition keyframes (`view-fade-in`, `view-fade-out`) are defined in `src/app/globals.css`. Respect the `prefers-reduced-motion` media query.

### B. Tailwind CSS v4 & Styling Standards
- Respect the design system tokens defined in `src/app/globals.css`:
  - Primary Background: `bg-bg-primary` (#FFFFFF)
  - Dark/Text Accent: `bg-bg-dark` / `text-text-primary` (#111111)
  - Headings Font: `font-heading` (Plus Jakarta Sans)
  - Body Font: `font-body` (Inter)
- DO NOT invent arbitrary hex values inline if standard theme tokens exist in `globals.css`.

### C. Component & Data Architecture
- Place shared layout primitives in `src/components/shared/`, navigation in `src/components/navigation/`, home sections in `src/components/home/`, and listing sections in `src/components/properties/`.
- Edition of record for agents, testimonials, journal: `src/lib/data/`. Images must come from the validated pool in `src/lib/images.ts` (`LAGOS_IMAGES`) — do not introduce unvalidated image URLs.
- **Browse-side properties come from Supabase** (the `properties` table, `publish_status = 'live'`), queried via the anon client in `src/lib/supabase/anon.ts`. Use `src/lib/property-live.ts` (`fetchLiveProperties`, `fetchLivePropertyBySlug`, `mapPropertyRow`) for browse-side queries and DB-row → camelCase `Property` mapping. Public queries and `mapPropertyRow` filter to `status IN ('For Rent','For Sale')`, non-land `property_type`s, and `category IN ('rental','commercial','resale')` — Off-Plan/Land rows never reach the UI. Do NOT import `properties` from `src/lib/data/properties.ts` for user-facing rendering — that file is the seed fixture only.
- **Browse queries are cached** (`unstable_cache`, tag `"properties"`, 60s revalidate, anon client in `src/lib/supabase/anon.ts` — never call `cookies()` inside a cached function). Server actions invalidate with `updateTag("properties")` after save/archive/unarchive/delete. Auth state in the navbar uses `getSession()` (local cookie read, no network) via `src/lib/navbar-user.ts`; the dashboard layout is the only place that does the verified `getUser()` round-trip.
- `src/lib/listing-utils.ts` derives `category` (`deriveCategory`) and unique kebab-case `slug` (`uniqueSlug` — appends `-2`/`-3` on collision; the DB `slug` UNIQUE constraint is the backstop). `src/lib/format.ts` (`formatPrice`) derives `price_label` (`" / yr"` for For Rent).
- Sellers upload images to the `property-images` bucket at path `{seller_id}/{uuid}/{filename}` (RLS folder-scoping depends on this shape). Uploads happen client-side in `src/components/dashboard/ListingForm.tsx`; fresh UUID folder on create, folder UUID parsed from existing image URLs on edit.
- Default to React Server Components (RSC). Apply `'use client'` strictly to interactive leaf components (stateful filters, drawers, interactive cards).
- Client components that read search params (`useSearchParams`) MUST be wrapped in a `<Suspense>` boundary at their render site (layout or page), or static prerendering of that route fails.

### D. Routing & Navigation
- All internal navigation uses `next/link`. Programmatic navigation uses `useRouter` (`router.push` / `router.replace(..., { scroll: false })` for filter updates). No `window.location` for internal navigation.
- `Navbar` highlights the active route via `usePathname` + `useSearchParams` (the property links resolve by the `status` query param; the property categories are Rentals `/properties?status=For Rent` and Sales `/properties?status=For Sale` — **Off-Plan and Land are removed from the product**).
- Auth surfaces: `/sell` (marketing), `/auth/sign-up`, `/auth/login`, and the seller dashboard under `/dashboard` (session-checked server-side in `src/app/dashboard/layout.tsx`). Dashboard routes: `/dashboard/listings/new` (create form) and `/dashboard/listings/[id]/edit` (404s when the row is not the caller's — RLS + `seller_id` scoping). Server actions live in `src/app/dashboard/actions.ts` (`saveListing`, `archiveListing`, `unarchiveListing`, `deleteListing`); `signOut` in `src/app/auth/actions.ts`. Navbar auth state is fetched server-side via `src/lib/navbar-user.ts` and passed in as a prop. Sellers only — buyers never authenticate.
- `src/proxy.ts` (the Next 16 successor to `middleware.ts`) refreshes the Supabase session cookie on every request; do not remove or duplicate it. No `pages/` directory.

### E. TypeScript
- Explicitly type all component props, API parameters, and database query results.
- Zero `any` policy: avoid `any` types; use `unknown` with narrowing where needed.

---

## 3. Strict Guardrails (Forbidden Actions)

- ❌ DO NOT import from `next/link` — use standard `<a>` tags or Next.js `<Link>` as needed (import from `next/link` is allowed in this project).
- ❌ DO NOT use the legacy Next.js Pages Router (`pages/` directory).
- ❌ DO NOT add an editing layer for curated content (agents, testimonials, journal): it belongs in `src/lib/data/`. Seller-submitted properties DO go to Supabase (that is the product).
- ❌ DO NOT loosen RLS conventions: every auth-dependent policy is `TO authenticated`, INSERT/UPDATE policies carry `WITH CHECK`, and SECURITY DEFINER helpers pin `search_path` with EXECUTE revoked from PUBLIC/anon.
- ❌ DO NOT remove the `ViewTransition` wrapper from the root layout.
- ❌ DO NOT add new external image domains to `next.config.ts` without validating the URLs return HTTP 200.
- ❌ DO NOT expose `SUPABASE_SERVICE_ROLE_KEY` to the client — server-only (seed scripts, Server Actions).

---

## 4. Agent Execution Strategy

When executing tasks via OpenCode, follow this multi-phase workflow:

1. **Inspection Phase:** Read existing files in `src/app/`, `src/components/`, and `src/lib/` before introducing new components.
2. **Planning Phase (Plan Mode):** Draft a step-by-step implementation breakdown (checking imports, path aliases, and Tailwind v4 compatibility).
3. **Execution Phase (Act Mode):** Implement modular, clean TypeScript code following existing patterns.
4. **Validation Phase:** Verify that new features maintain smooth transitions and type checks pass via `npm run build`.

---

## 5. Definition of Done (Validation Checklist)

Before declaring any task complete, verify:

- [ ] TypeScript compiles cleanly via `npm run build`.
- [ ] Proper `viewTransitionName` properties bind uniquely using record IDs where applicable.
- [ ] Tailwind utility classes reference existing design tokens (`bg-bg-primary`, `font-heading`, etc.).
- [ ] Mobile and desktop responsiveness adhere to project breakpoints (`sm:`, `md:`, `lg:`).
- [ ] No dead code, commented-out code, or console.log statements remain.
- [ ] Data in `src/lib/data/` stays internally consistent (unique IDs, filter values match `PropertyCategory`/`status` unions).
- [ ] Changes are committed with a descriptive message.
