# Vestra Atelier

A virtual fitting room and marketing site for fashion brands. Shoppers upload a photograph, compose an outfit from a garment catalogue, and see the full look rendered on themselves in seconds.

The try-on on this site runs in demo mode: it uses sample looks and a simulated render pipeline, labeled with a "Preview" badge. A live pilot with real-time AI rendering is a separate scope.

## Highlights

- **Maison design system.** A warm, editorial aesthetic built on a bone-and-saffron palette, Fraunces serif and Inter Tight sans-serif, fabric-like shadows, and iridescent shimmer reserved for AI moments. No dark mode, no glassmorphism, no emoji.
- **Interactive fitting room.** Choose a shopper (preset or upload), pick garments by category, apply outfit presets (Casual, Professional, Night Out), generate a render, save/share/shop the look. ARIA live region announces render progress; `prefers-reduced-motion` is honoured throughout.
- **Eleven marketing sections.** Hero, Problem, Solution, How It Works, Lookbook, Stats, For Brands, Integrations, Pricing, FAQ, and a final CTA with newsletter capture.
- **Legal and privacy.** GDPR and India DPDP privacy policy, terms of service, cookie consent banner that gates analytics, photo retention notice at the upload point.
- **Security headers.** CSP, HSTS with preload, X-Frame-Options DENY, Permissions-Policy (camera/mic/geo denied), applied to every response.
- **SEO.** Server-side rendering, JSON-LD structured data (Organization, WebSite, SoftwareApplication), sitemap, OG and Twitter Card meta tags on every page, Lighthouse SEO 100.
- **Accessibility.** Lighthouse Accessibility 100. Keyboard navigable, skip-to-content link, labelled inputs, descriptive alt text, sufficient contrast ratios.
- **PWA.** Service worker with offline fallback, web app manifest with SVG icons.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TanStack Start (SSR), TanStack Router (file-based routing) |
| Build | Vite 8, Nitro |
| Styling | Tailwind CSS 4, custom Maison design tokens |
| Components | Radix UI / shadcn/ui primitives, Framer Motion animations |
| Validation | Zod schemas |
| Language | TypeScript (strict) |
| Tests | Vitest (unit/integration), Playwright (E2E) |
| CI | GitHub Actions (typecheck, lint, unit tests, E2E, build) |

## Prerequisites

- Node.js 20 or later
- npm (ships with Node)
- For E2E tests: `npx playwright install` to download browser binaries

## Getting started

```bash
git clone https://github.com/Sriharsan/vestra-atelier.git
cd vestra-atelier
npm install
npm run dev
```

The dev server starts on **http://localhost:5173**.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript strict type check |
| `npm run lint` | ESLint + Prettier |
| `npm run format` | Auto-format with Prettier |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:unit` | Same as `test` |
| `npm run test:e2e` | Run E2E tests (Playwright, headless) |

## Environment

Copy `.env.example` to `.env` and fill in values as needed. No secrets are committed to this repository.

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `VITE_SITE_URL` | For production | Your production URL (e.g. `https://vestra.ai`) |
| `VITE_TRYON_MODE` | No | `demo` (default) or `live` |
| `TRYON_PROVIDER` | For live mode | Provider: `gradio`, `fashn`, `fal`, or `none` |
| `TRYON_API_URL` | For live mode | URL of the rendering API (e.g. `franciszzj/Leffa`) |
| `TRYON_API_KEY` | For live mode | HuggingFace token or provider API key (server-side only) |
| `PEXELS_API_KEY` | For seeding | Free key for demo asset script (see `handoff/SEED.md`) |
| `ANALYTICS_WRITE_KEY` | Optional | PostHog, Segment, or similar |
| `CRM_WEBHOOK_URL` | Optional | Endpoint for contact form submissions |
| `SENTRY_DSN` | Optional | Error tracking |

All `VITE_`-prefixed variables are public (bundled into the client). Everything else is server-only, read via `src/lib/config.server.ts`.

## Project structure

```
src/
  routes/           File-based routing (TanStack Router)
  sections/         Marketing page sections (Hero, Problem, Solution, etc.)
  components/       Shared UI (Header, Footer, CookieConsent, StructuredData)
  components/ui/    shadcn/ui primitives (accordion, button, dialog, etc.)
  data/             Centralised marketing copy and garment catalogue
  lib/              Utilities — security headers, validation, rate limiting
  lib/stubs/        Backend stubs (analytics, auth, forms, storage, try-on)
  hooks/            Custom React hooks (reduced motion, etc.)
  assets/           Images
  styles.css        Maison design tokens and utility classes
  server.ts         SSR entry with security headers and health endpoint
e2e/                Playwright E2E tests
handoff/            Client delivery documents
public/             Static assets (sitemap, manifest, icons, service worker)
.github/workflows/  CI pipeline
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage (11 sections) |
| `/shop` | Product catalogue (10 pieces, filters, sort) |
| `/try-on` | Virtual fitting room demo |
| `/for-brands` | Brand partnership page |
| `/contact` | Demo request form |
| `/about` | About page |
| `/privacy` | Privacy policy (GDPR, India DPDP) |
| `/terms` | Terms of service |

## Deployment

See `handoff/DEPLOY.md` for the full Vercel deployment runbook, including build settings, environment variables, and domain configuration.

## Status and roadmap

This is a **complete demo-mode delivery** (v1.0.0). The try-on uses sample looks with a simulated render pipeline. Five items are deferred with documented reasons and triggers:

- CSP `unsafe-inline` — framework constraint (TanStack Start hydration)
- CSRF tokens — no server form handler exists yet
- Zod validation / rate limiter not wired to handlers — no server endpoints beyond `/api/health`
- Live try-on — mocked by design; integrate a real provider when chosen

The two clear next steps, each a separate scope:

1. **Wire a real try-on provider** — replace the stub in `src/lib/stubs/tryOn.ts` with a real inference endpoint, connect Zod validation and rate limiting to the new handlers, add CSRF protection.
2. **Storefront** (optional, separate build) — if the client wants to sell directly, that is a new scope covering catalogue, cart, checkout, orders, and payments.

Full details in `SHIP-REPORT.md` and `PHASE-VERIFICATION.md`.

## What the client provides

See `handoff/WHAT-I-NEED-FROM-YOU.md` for the full list: brand assets, real statistics, try-on API credentials, form endpoints, domain, legal review, and more.

## Ownership

Built by Sriharsan. All rights reserved.
