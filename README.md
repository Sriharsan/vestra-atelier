# Vestra Atelier

A virtual fitting room and marketing site for fashion brands. Shoppers upload a photograph, choose a garment from the catalogue, and see a full try-on render composed on themselves.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TanStack Start (SSR), TanStack Router (file-based routing) |
| Build | Vite 8, Nitro |
| Styling | Tailwind CSS 4, custom Maison design tokens |
| Components | Radix UI / shadcn/ui primitives, Framer Motion animations |
| Validation | Zod schemas, server-side rate limiting |
| Language | TypeScript (strict) |
| Tests | Vitest (unit/integration), Playwright (E2E) |
| Deployment | Vercel (SSR via Nitro) |

## Getting started

```bash
git clone https://github.com/Sriharsan/vestra-atelier.git
cd vestra-atelier
cp .env.example .env
npm install
npm run dev
```

The dev server starts on **http://localhost:5173**.

### Prerequisites

- Node.js 20+
- npm (ships with Node)
- For E2E tests: `npx playwright install chromium`

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Production build (Vite + Nitro for Vercel) |
| `npm run typecheck` | TypeScript strict type check |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright, headless Chromium) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage (Hero, Problem, Solution, How It Works, Lookbook, Stats, For Brands, Integrations, Pricing, FAQ, CTA) |
| `/shop` | Product catalogue (10 pieces, filters, sort) |
| `/try-on` | Virtual fitting room with comparison slider |
| `/for-brands` | Brand partnership page |
| `/contact` | Demo request form |
| `/about` | About page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/privacy` | Privacy policy (GDPR, India DPDP) |
| `/terms` | Terms of service |

### API routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/tryon` | POST | Try-on generation (live mode only) |
| `/api/demo` | GET | Demo catalogue data |
| `/api/subscribe` | POST | Newsletter subscription |
| `/api/orders` | POST | Order placement |

## Try-on modes

### Demo mode (default)

Set `VITE_TRYON_MODE=demo` (or leave unset). The fitting room uses 6 pre-baked result images with a simulated rendering animation. No API keys or backend services needed. The 6 looks cover 3 women's Indian outfits (Churidar Kurta, Lehenga Choli, Salwar Kameez) and 2 men's (Kurta with Nehru Jacket, Sherwani).

### Live mode

Set `VITE_TRYON_MODE=live` and configure a try-on provider. The fitting room sends the shopper photo and garment image to the provider API and returns a real-time composite.

Supported providers:

| Provider | Env var | Notes |
|----------|---------|-------|
| Gemini | `GEMINI_API_KEY` | Uses `gemini-2.5-flash-image` model. Auto-detected if key is set. Requires billing-enabled Google AI key. |
| FASHN | `FASHN_API_KEY` | Direct API at fashn.ai |
| fal.ai | `FAL_KEY` | Runs FASHN model on fal infrastructure |
| Gradio | `TRYON_API_KEY` | HuggingFace Spaces (e.g. Leffa) |

The `/api/tryon` endpoint enforces rate limiting (10 requests/min, 20 per session) and validates input with Zod.

## Environment variables

Copy `.env.example` to `.env`. No secrets are committed.

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `VITE_SITE_URL` | Production | Public URL (e.g. `https://vestra.ai`) |
| `VITE_TRYON_MODE` | No | `demo` (default) or `live` |
| `TRYON_PROVIDER` | Live mode | `gemini`, `fashn`, `fal`, `gradio`, or `none` |
| `GEMINI_API_KEY` | Gemini provider | Google AI Studio key (server-side only) |
| `FASHN_API_KEY` | FASHN provider | fashn.ai API key |
| `FAL_KEY` | fal provider | fal.ai API key |
| `TRYON_API_KEY` | Gradio provider | HuggingFace token |
| `MONGODB_URI` | Optional | MongoDB connection string for form submissions |
| `PEXELS_API_KEY` | Seeding only | Free key for demo asset script |
| `ANALYTICS_WRITE_KEY` | Optional | PostHog or Segment key |
| `CRM_WEBHOOK_URL` | Optional | Contact form webhook |
| `SENTRY_DSN` | Optional | Error tracking |

All `VITE_`-prefixed variables are bundled into the client. Everything else is server-only, read via `src/lib/config.server.ts`.

## Project structure

```
src/
  routes/           File-based routing (TanStack Router)
  sections/         Marketing page sections
  components/       Shared UI (Header, Footer, CookieConsent, StructuredData)
  components/ui/    shadcn/ui primitives
  data/             Garment catalogue, try-on catalogue, marketing copy
  lib/              Security headers, validation, rate limiting, try-on providers
  lib/stubs/        Client-side stubs (analytics, auth, forms, storage, try-on)
  hooks/            Custom React hooks
  assets/           Bundled images
  styles.css        Maison design tokens and utility classes
  server.ts         SSR entry with security headers, API routes, rate limiting
e2e/                Playwright E2E tests
scripts/            Asset seeding and try-on baking scripts
public/demo/        Demo assets (people, garments, results, shop images)
```

## Deployment

### Vercel

1. Import the repository in Vercel.
2. Framework preset: **Vite**.
3. Build command: `vite build` (auto-detected).
4. Set environment variables in the Vercel dashboard:
   - `VITE_TRYON_MODE=demo`
   - `VITE_SITE_URL=https://your-domain.com`
   - Any provider keys for live mode.
5. Deploy.

The build outputs to `.vercel/output/` via Nitro's Vercel preset. SSR and static assets are handled automatically.

## Highlights

- **Maison design system.** Bone-and-saffron palette, Fraunces serif and Inter Tight sans-serif, fabric-like shadows, iridescent shimmer for try-on moments.
- **Interactive fitting room.** Choose a person preset or upload your own photo, pick a garment, see the result in a before/after comparison slider. Download, share, or shop the look.
- **Security headers.** CSP, HSTS with preload, X-Frame-Options DENY, Permissions-Policy (camera/mic/geo denied).
- **SEO.** Server-side rendering, JSON-LD structured data, sitemap, OG and Twitter Card meta.
- **Accessibility.** Keyboard navigable, ARIA live region for render progress, labelled inputs, `prefers-reduced-motion` honoured.
- **PWA.** Service worker with offline fallback, web app manifest.
- **Legal.** GDPR and India DPDP privacy policy, terms of service, cookie consent banner.

## Ownership

Built by Sriharsan. All rights reserved.
