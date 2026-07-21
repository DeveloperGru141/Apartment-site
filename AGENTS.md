# HORIZON — Apartment Rental Platform

## 1. Executive Summary & Architecture

This repository contains the **HORIZON** luxury apartment rental platform. Built with **Next.js 16 (App Router)**, **TypeScript 5.7+**, **Tailwind CSS v4**, and **Supabase**.

All automated agents and execution flows MUST maintain strict adherence to Next.js App Router patterns, atomic component structure, strict type safety, and fluid View Transitions.

### Primary Tech Stack & Structure
- **Framework:** Next.js 16.x (App Router, Turbopack)
- **Language:** TypeScript 5.7.x
- **Styling:** Tailwind CSS v4 (`@theme` variables in `src/app/globals.css`)
- **Database / Auth:** Supabase (`@supabase/ssr`)
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
- Place shared layout primitives in `src/components/shared/` and section-specific modules in `src/components/landing/`.
- Keep centralized constants in `src/lib/constants.ts` (e.g., `PUBLIC_ROUTES`, `UUID_RE`).
- Default to React Server Components (RSC). Apply `'use client'` strictly to interactive leaf components (stateful filters, drawers, interactive cards).

### D. Supabase Integration & Auth
- **Server client:** `src/lib/supabase/server.ts` — uses `getAll`/`setAll` cookie methods with optional `NextResponse` fallback for Route Handlers.
- **Browser client:** `src/lib/supabase/browser.ts` — uses `createBrowserClient`.
- **Auth context:** `src/lib/auth/AuthProvider.tsx` provides `user`, `isLoading`, `signOut`, `handleLogout`, `fetchWithAuth`.
  - `handleLogout` calls `signOut()` then `window.location.replace("/login?error=session_expired")`.
  - `fetchWithAuth` intercepts 401 responses and redirects to login.
- **Route protection:** `src/proxy.ts` (Next.js 16 `proxy` convention, not `middleware.ts`). Uses `isPublicRoute`/`isAuthRoute` from `constants.ts`.
  - Matcher excludes `/api/`, `/_next/`, images.
- **API auth:** Use `requireAuth()` from `@/lib/auth/server` in Route Handlers. Returns the user or throws 401.
- **Cookie note:** In Route Handlers ALWAYS pass a `NextResponse` to `createClient(response)` so `setAll` can fall back to `response.cookies.set()`.

### E. TypeScript
- Explicitly type all component props, API parameters, and database query results.
- Zero `any` policy: avoid `any` types; use `unknown` with narrowing where needed.

---

## 3. Strict Guardrails (Forbidden Actions)

- ❌ DO NOT import from `next/link` — use standard `<a>` tags or Next.js `<Link>` as needed (import from `next/link` is allowed in this project).
- ❌ DO NOT use the legacy Next.js Pages Router (`pages/` directory).
- ❌ DO NOT expose Supabase Service Keys or sensitive environment variables in client-side components.
- ❌ DO NOT add mock/fake data for features that have real API endpoints (e.g., favorites, listings).
- ❌ DO NOT remove the `ViewTransition` wrapper from the root layout.

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
- [ ] Auth flow works: login → dashboard renders, middleware does not redirect back to login.
- [ ] Changes are committed with a descriptive message.
